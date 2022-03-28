import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Slide } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IOrder from 'interfaces/models/order';
import React, { forwardRef, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import orderService from 'services/order';
import * as Yup from 'yup';

const useStyles = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)',
    display: 'flex',
    flexDirection: 'column'
  }
});

const validationSchema = Yup.object().shape({
  quantity: Yup.number().positive().required('A quantidade do pedido é obrigatória!'),
  description: Yup.string().min(3).max(250).required('A descrição do pedido é obrigatória!'),
  value: Yup.number().positive().required('O valor do pedido é obrigatório!')
});

interface IProps {
  order: IOrder;
  open: boolean;
  onCancel: () => void;
  onComplete: (order: IOrder) => void;
}

const FormDialog = memo((props: IProps) => {
  const classes = useStyles();

  const formik = useFormikObservable<IOrder>({
    initialValues: {},
    onSubmit(model) {
      return orderService.save({ ...model, quantity: Number(model.quantity) }).pipe(
        tap(order => {
          Toast.show(`O pedido: ${order.description}, valor: ${order.value} foi salvo com sucesso!`);
          props.onComplete(order);
        }),
        logError(true)
      );
    },
    validationSchema
  });

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  const handleEnter = useCallback(() => {
    formik.setValues(props.order || formik.initialValues);
  }, [props.order, formik]);

  return (
    <Dialog
      open={props.open}
      onEnter={handleEnter}
      onExited={handleExit}
      disableEscapeKeyDown
      TransitionComponent={Transition}
      disableBackdropClick
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Pedido</DialogTitle>
        <DialogContent className={classes.content}>
          <TextField name='description' formik={formik} label='Descrição' />
          <TextField name='quantity' formik={formik} label='Quantidade' style={{ flex: 1 }} type="number"/>
          <TextField name='value' formik={formik} label='Valor' mask='money' style={{ flex: 1 }} />
          <DialogActions>
            <Button onClick={props.onCancel}>Cancelar</Button>
            <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
              Salvar
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
