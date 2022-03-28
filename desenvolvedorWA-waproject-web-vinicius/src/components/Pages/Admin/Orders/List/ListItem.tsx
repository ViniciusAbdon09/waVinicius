import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import IOrder from 'interfaces/models/order';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';

interface IProps {
  order: IOrder;
  onDeleteComplete: () => void;
  handleEdit: (order: IOrder) => void;
}

const ListItem = memo((props: IProps) => {
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleDismissError = useCallback(() => {}, []);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o pedido ${props.order.description}?`)).pipe(
      filter(confirmed => confirmed),
      tap(() => setLoading(true)),
      switchMap(() => orderService.delete(props.order.id)),
      logError(),
      tap(
        () => {
          Toast.show(`O pedido "${props.order.description}" foi excluido com sucesso!`);
          setLoading(false);
          setDeleted(true);
          props.onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const currency = (value: number): string => {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Editar', icon: EditIcon, handler: () => props.handleEdit(props.order) },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, props]);

  if (deleted) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{props.order.description}</TableCell>
      <TableCell>{props.order.quantity}</TableCell>
      <TableCell>{currency(props.order.value)}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default React.memo(ListItem);
