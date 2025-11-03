import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const contactSchema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  bookTitle: yup.string().required('El título del libro es obligatorio'),
  author: yup.string(),
  requestType: yup.string().required('Selecciona el tipo de solicitud'),
  message: yup.string().required('La descripción es obligatoria').min(10, 'Mínimo 10 caracteres'),
  urgency: yup.string().default('normal'),
  consent: yup.boolean().oneOf([true], 'Debes aceptar los términos')
});

export const useContactForm = () => {
  return useForm({
    defaultValues: {
      name: '',
      email: '',
      bookTitle: '',
      author: '',
      requestType: '',
      message: '',
      urgency: 'normal',
      consent: false
    },
    mode: 'onChange'
  });
};