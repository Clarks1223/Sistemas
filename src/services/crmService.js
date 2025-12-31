import api from './api';

export const crmService = {
  /**
   * Uploads CRM files to the backend.
   * @param {FormData} formData - The form data containing 'judicial', 'vigente', and 'clientes' files.
   * @returns {Promise} - Axios response promise.
   */
  uploadFiles: (formData) => {
    return api.post('crm/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
