import os
import paramiko
import pandas as pd
from datetime import datetime
from io import StringIO, BytesIO

def convertir_valor(valor):
    if isinstance(valor, str):
        try:
            fecha = datetime.strptime(valor, '%Y-%m-%d %H:%M:%S')
            return fecha.strftime('%d/%m/%Y')
        except ValueError:
            return valor.replace('.', ',') if valor.replace('.', '', 1).isdigit() else valor
    return valor


def obtener_configuracion_salida(key):
    """
    Determina la carpeta y nombre de salida basado estrictamente en la clave del archivo.
    Reglas de nombres finales:
    - vigente -> CarteraVigente_CargaCRM-NEOCRM-YYYYMMDD.txt
    - judicial -> CarteraJudicial_CargaCRM-NEOCRM-YYYYMMDD.txt
    - clientes -> Clientes-NEOCRM-YYYYMMDD.txt
    """
    # Usamos fecha actual como en la logica original y como fallback seguro
    fecha = datetime.now().strftime("%Y%m%d")
    
    config = {
        "vigente": {
            "carpeta": "Cartera Vigente",
            "nombre_salida": f"CarteraVigente-NEOCRM-{fecha}.txt"
        },
        "judicial": {
            "carpeta": "Cartera Judicial",
            "nombre_salida": f"CarteraJudicial-NEOCRM-{fecha}.txt"
        },
        "clientes": {
            "carpeta": "Clientes",
            "nombre_salida": f"Clientes-NEOCRM-{fecha}.txt"
        }
    }
    
    datos = config.get(key)
    if datos:
        return datos["carpeta"], datos["nombre_salida"]
    return None, None


def excel_a_texto_stream(input_stream, output_filename):
    """
    Adaptado para aceptar stream (BytesIO) y retornar stream (StringIO).
    input_stream: Archivo Excel en memoria (UploadedFile o BytesIO)
    output_filename: Nombre del archivo de salida (solo para log/referencia)
    """
    try:
        # pd.read_excel acepta file-like objects (streams)
        df = pd.read_excel(input_stream, dtype=str, header=0)

        for col in df.columns:
            df[col] = df[col].map(convertir_valor)

        # Crear buffer en memoria para el CSV
        output_buffer = StringIO()
        
        # to_csv escribe al buffer
        df.to_csv(output_buffer, sep=";", index=False, header=True, quoting=1, quotechar='"', encoding="utf-8")
        
        # Resetear puntero al inicio para leerlo despues
        output_buffer.seek(0)
        
        # print(f"📄 Archivo TXT generado en memoria: {output_filename}")
        return output_buffer
    except Exception as e:
        print(f"❌ Error al convertir Excel a texto: {e}")
        return None


def cargar_archivo_sftp_stream(file_buffer, remote_filename, tipo_carpeta):
    """
    Adaptado para subir desde stream usando putfo.
    file_buffer: StringIO o BytesIO con el contenido del archivo TXT/CSV
    remote_filename: Nombre del archivo en el servidor remoto
    tipo_carpeta: Carpeta destino (Cartera Vigente, etc)
    """
    try:
        now = datetime.now()
        anio = now.strftime("%Y")
        mes = now.strftime("%m")

        SFTP_HOST = os.getenv('SFTP_HOST')
        SFTP_PORT = 2222
        # Validar credenciales minimas
        if not SFTP_HOST:
             msg = "Error: SFTP_HOST no definido en variables de entorno"
             print(f"❌ {msg}")
             return False, msg

        SFTP_USER = os.getenv('SFTP_USER')
        SFTP_PASS = os.getenv('SFTP_PASS')

        transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
        transport.connect(username=SFTP_USER, password=SFTP_PASS)
        sftp = paramiko.SFTPClient.from_transport(transport)

        # Crear directorios si no existen
        try:
            sftp.chdir("/home/coopcentro")
        except IOError:
            # Si carpeta base no existe, intentar crearla? El script original asumia que podia hacer chdir base.
            # Asumiremos la logica original:
            sftp.chdir("/home/coopcentro") # Esto fallaria si no existe, igual que original.

        for carpeta in [anio, tipo_carpeta, mes]:
            try:
                sftp.chdir(carpeta)
            except IOError:
                sftp.mkdir(carpeta)
                sftp.chdir(carpeta)
                # print(f"📁 Carpeta creada en el FTP: {sftp.getcwd()}")

        # Subir archivo desde stream
        # putfo requiere un file-like objeto y el nombre remoto
        # file_buffer es StringIO (texto), putfo usualmente espera bytes o texto dependiendo de modo?
        # Paramiko putfo lee bytes. StringIO contiene texto. Debemos codificar a BytesIO o usar modo adecuado.
        # Lo mas seguro es convertir el contenido del StringIO a BytesIO UTF-8.
        
        if isinstance(file_buffer, StringIO):
            bytes_buffer = BytesIO(file_buffer.getvalue().encode('utf-8'))
        else:
            bytes_buffer = file_buffer
            
        sftp.putfo(bytes_buffer, remote_filename)
        # print(f"✅ Archivo {remote_filename} subido exitosamente por SFTP.")

        sftp.close()
        transport.close()
        return True, "Subida exitosa"

    except Exception as e:
        error_msg = f"Error SFTP: {str(e)}"
        print(f"❌ {error_msg}")
        return False, error_msg
