import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Box,
  Typography,
  Divider
} from '@mui/material';

const initialFormState = {
  instrumentNumber: "",
  issuerIdType: "",
  issuerId: "",
  issueDate: "",
  purchaseDate: "",
  instrumentType: "",
  issuerCountry: "",
  nominalValueUsd: "",
  purchaseValueUsd: "",
  couponPaymentPeriodDays: "",
  issuerClassification: "",
  issuerType: "",
  maturityDate: "",
  riskRating: "",
  ratingAgency: "",
  lastRatingDate: "",
  accountCode: "",
  bookValueUsd: "",
  instrumentStatus: "",
  nominalInterestRate: "",
  accruedInterestUsd: "",
  regulatoryRiskRating: "",
  provisionAmountUsd: ""
};

const structures = {
  i01: [
    "instrumentNumber",
    "issuerIdType",
    "issuerId",
    "issueDate",
    "purchaseDate",
    "instrumentType",
    "issuerCountry",
    "nominalValueUsd",
    "purchaseValueUsd",
    "couponPaymentPeriodDays",
    "issuerClassification",
    "issuerType"
  ],
  i02: [
    "instrumentNumber",
    "issuerIdType",
    "issuerId",
    "issueDate",
    "purchaseDate",
    "maturityDate",
    "riskRating",
    "ratingAgency",
    "lastRatingDate",
    "accountCode",
    "bookValueUsd",
    "instrumentStatus",
    "nominalInterestRate",
    "accruedInterestUsd",
    "regulatoryRiskRating",
    "provisionAmountUsd"
  ]
};

export function InversionesForm({ onSubmit, onCancel, structure = 'i01', initialData = null }) {
  const [formData, setFormData] = useState(initialData || initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Helper to format label
  const getLabel = (key) => {
    const labels = {
        instrumentNumber: "No. Instrumento",
        issuerIdType: "Tipo ID Emisor",
        issuerId: "ID Emisor",
        issueDate: "Fecha Emisión",
        purchaseDate: "Fecha Compra",
        instrumentType: "Tipo Instrumento",
        issuerCountry: "País Emisor",
        nominalValueUsd: "Valor Nominal USD",
        purchaseValueUsd: "Valor Compra USD",
        couponPaymentPeriodDays: "Días Pago Cupón",
        issuerClassification: "Clasificación Emisor",
        issuerType: "Tipo Emisor",
        maturityDate: "Fecha Vencimiento",
        riskRating: "Calif. Riesgo",
        ratingAgency: "Agencia Calif.",
        lastRatingDate: "Fecha Últ. Calif.",
        accountCode: "Cuenta Contable",
        bookValueUsd: "Valor Libros USD",
        instrumentStatus: "Estado Instrumento",
        nominalInterestRate: "Tasa Interés Nom.",
        accruedInterestUsd: "Interés Devengado",
        regulatoryRiskRating: "Calif. Riesgo Reg.",
        provisionAmountUsd: "Provisión USD"
    };
    return labels[key] || key;
  };

  const currentFields = structures[structure] || [];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {currentFields.map((key) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <TextField
              fullWidth
              size="small"
              label={getLabel(key)}
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              type={key.toLowerCase().includes('date') ? 'date' : 'text'}
              InputLabelProps={key.toLowerCase().includes('date') ? { shrink: true } : {}}
              variant="outlined"
            />
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {initialData ? 'Actualizar' : 'Guardar'} Inversión
        </Button>
      </Box>
    </Box>
  );
}
