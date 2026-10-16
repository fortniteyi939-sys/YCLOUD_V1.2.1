import { useDatos } from '../../hooks/useDatos'
import { ALMACENES, nombreTercero } from '../../services/datos'
import { recibirOrdenCompra } from '../../services/operaciones'
import { fechaCorta, sumar } from '../../utils/format'
import PageHeader from '../../components/PageHeader'
import PasoAPaso from '../../components/PasoAPaso'
import DataTable from '../../components/DataTable'
import PanelResumen from '../../components/PanelResumen'
import Badge from '../../components/Badge'

export default function RecepcionPage() {
  const { datos: d, ejecutar } = useDatos()
  const r = d.ordenesCompra
  const pend = r.filter(o => o.estado === 'Pendiente').length
  return (
    <>
      <PageHeader titulo="Ingreso al Kardex" descripcion="Recibe órdenes de compra pendientes y confirma la entrada de productos al almacén." />
      <PasoAPaso clave="recepcion" />
      <div className="lay">
        <DataTable
          filas={r}
          texto={x => x.id + nombreTercero(d, x.proveedor)}
          estado={x => x.estado}
          fecha={x => x.fecha}
          estadoInicial="Pendiente"
          almacen={x => x.almacen}
          almacenes={ALMACENES}
          placeholder="Buscar nota, OC o proveedor…"
          csv={{ archivo: 'recepcion', fila: x => [x.id, fechaCorta(x.fecha), nombreTercero(d, x.proveedor), x.almacen, sumar(x.lineas, l => l.cantidad), x.estado] }}
          columnas={[
            { titulo: 'N.º documento', celda: x => <code>{x.id}</code>, orden: x => x.id },
            { titulo: 'Fecha', celda: x => fechaCorta(x.fecha), orden: x => x.fecha },
            { titulo: 'Proveedor', celda: x => nombreTercero(d, x.proveedor), orden: x => nombreTercero(d, x.proveedor) },
            { titulo: 'Almacén', celda: x => x.almacen },
            { titulo: 'Unidades', celda: x => sumar(x.lineas, l => l.cantidad) },
            { titulo: 'Estado', celda: x => <Badge estado={x.estado} />, orden: x => x.estado },
            { titulo: '', celda: x => x.estado === 'Pendiente' ? <button className="pri" onClick={() => ejecutar(c => recibirOrdenCompra(c, x.id))}>Registrar ingreso</button> : '' }
          ]}
        />
        <PanelResumen general={[['Notas de ingreso', r.length - pend], ['OC por recibir', pend], ['Unidades ingresadas', sumar(d.kardex.filter(k => k.operacion === 'Entrada'), k => k.cantidad)], ['Almacenes activos', ALMACENES.length]]} />
      </div>
    </>
  )
}
