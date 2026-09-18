import logoMeUp from "@/assets/logo-meup.png";

const fmt = (n: number) =>
  n?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 }) ?? "";


export function PlantillaCorta({ oferta }: { oferta: any }) {
  const { numero, fecha, cliente, asesor, items, totales, pesoTotalKg } = oferta ?? {};

  return (
    <div className="oferta-corta">
      {/* HEADER */}
      <div className="header-grid">
        <div className="header-logo">
          <img src={logoMeUp} alt="MeUp" className="logo-img" />
          <div className="asesor-info">
            <p><strong>Asesor:</strong> {asesor?.nombre}</p>
            <p><strong>Email:</strong> {asesor?.email}</p>
            <p><strong>Celular:</strong> {asesor?.telefono}</p>
          </div>
        </div>
        <div className="header-right">
          <h1 className="titulo-cotizacion">Cotización</h1>
          <div className="numero-box">
            <span className="numero-label">Numero:</span>
            <span className="numero-valor">{numero}</span>
          </div>
          <div className="realizada-box">
            <span>Realizada por:</span><br />
            <strong>Meup</strong>
          </div>
          <div className="cliente-box">
            <p><strong>Para:</strong> {cliente?.nombre}</p>
            <p><strong>Documento:</strong> {cliente?.documento}</p>
            <p><strong>Fecha:</strong> {fecha}</p>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <p className="intro">
        Es un placer saludarle y nos complace presentar nuestra oferta comercial, esperamos que nuestra propuesta sea de su mayor interés y que cumpla plenamente sus expectativas.
      </p>
      <p className="intro">
        MeUp.co es una marca de Paris Ingenieros SAS NIT. 900570024-6, para todos sus efectos legales y normativos en Colombia. Resolución SIC 17191 del 31 de marzo de 2022.
      </p>

      {/* TABLA PRODUCTOS */}
      {(() => {
        const {
          subtotalProductosSinIva,
          subtotalTransporteSinIva,
          ivaProductos,
          ivaTransporte,
          retenciones,
          total,
        } = totales ?? {};
        const porFuera = (subtotalTransporteSinIva ?? 0) > 0;
        return (
          <>
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>UNIDAD DE MEDIDA</th>
                  <th>CANTIDAD</th>
                  <th>VR. UNITARIO</th>
                  <th>VR. BRUTO</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>
                      <strong>{item.nombreComercial ?? item.descripcion?.split("·")[0]?.trim()}</strong><br/>
                      <span>Espesor {item.espesor}</span><br/>
                      <span>Acabado {item.acabado}</span><br/>
                      <span>Formato {item.formato}</span>
                    </td>
                    <td>{item.unidad}</td>
                    <td>{item.cantidad}</td>
                    <td>{fmt(item.vrUnitario)}</td>
                    <td>{fmt(item.vrBruto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALES */}
            <table className="tabla-totales">
              <tbody>
                <tr><td>Subtotal productos</td><td>{fmt(subtotalProductosSinIva)}</td></tr>
                {porFuera ? (
                  <tr><td>Transporte {pesoTotalKg} Kg</td><td>{fmt(subtotalTransporteSinIva)}</td></tr>
                ) : (
                  <tr><td>Transporte</td><td>Incluido en ítems</td></tr>
                )}
                <tr><td>IVA 19%</td><td>{fmt((ivaProductos ?? 0) + (ivaTransporte ?? 0))}</td></tr>
                <tr><td>Retenciones</td><td>{fmt(retenciones)}</td></tr>
                <tr className="total"><td><strong>TOTAL</strong></td><td><strong>{fmt(total)}</strong></td></tr>
              </tbody>
            </table>
          </>
        );
      })()}

      {/* NOTA TÉCNICA */}
      <p className="nota-tecnica">
        Las piedras naturales como mármoles, travertinos, granitos, areniscas y calizas son materiales únicos, con variaciones propias de su origen natural en color, vetas, porosidad y textura, estas diferencias no se consideran defectos. El corte de cada pieza se realiza de manera individual, por lo que pueden presentarse ligeras variaciones en calibre, medida o escuadra, las cuales son normales y son completamente aprovechables durante la instalación.
      </p>
      <p className="nota-tecnica">
        Es indispensable que la instalación sea realizada por personal especializado y con experiencia, utilizando productos complementarios adecuados como pegantes, boquillas y selladores. Una instalación inadecuada o el uso de materiales no recomendados puede comprometer tanto la estética como el desempeño del producto.
      </p>
      <p className="nota-tecnica">
        Recomendamos agregar un 5% adicional sobre el área a cubrir por concepto de desperdicio, cortes y roturas durante la instalación. Este porcentaje puede variar según la complejidad del diseño o el tipo de corte requerido.
      </p>
      <p className="nota-tecnica">
        En áreas sometidas a alto tráfico, cargas puntuales o tránsito vehicular, se requiere la validación técnica del ingeniero, arquitecto o calculista responsable del proyecto.
      </p>

      {/* CONDICIONES */}
      <h2 className="condiciones-titulo">Condiciones comerciales</h2>
      <ol className="condiciones-lista">
        <li><strong>Forma de Pago:</strong> <em>Material en inventario:</em> El pago debe realizarse en su totalidad de manera anticipada antes de programar el despacho. <em>Material fabricado bajo pedido:</em> Se establece un adelanto del 50% al inicio de la fabricación, seguido del 50% restante previo al despacho.</li>
        <li><strong>Tiempo de entrega:</strong> El tiempo de entrega se calcula y se indica específicamente en cada producto cotizado. Las entregas pueden ser únicas o fraccionadas según se acuerde.</li>
        <li><strong>Transporte y Descarga:</strong> Los costos de transporte no incluyen la descarga en el lugar de destino. Agradecemos anticipar la presencia de personal en el sitio el día de la entrega para realizar la descarga.</li>
        <li><strong>Procedimiento de Pago:</strong> Realizar la consignación en la cuenta Corriente Bancolombia #60246033762 o cuenta de ahorros Davivienda #001100134335, a nombre de Paris Ingenieros SAS, NIT. 900570024. Los pagos con tarjeta de crédito tendrán un incremento adicional del 2.99%.</li>
        <li><strong>Almacenamiento y Costos Adicionales:</strong> No se contemplan costos de almacenamiento. Una vez confirmada la fabricación, el material debe ser despachado en un plazo inferior a 30 días.</li>
        <li><strong>Seguro de Transporte:</strong> El transporte contratado con Paris Ingenieros SAS incluye póliza de seguros que protege la carga ante accidentes, hurtos, volcamiento o condiciones climáticas.</li>
        <li><strong>Pólizas:</strong> Los precios citados no incorporan gastos por pólizas.</li>
        <li><strong>Costos de Transporte:</strong> El valor del transporte ofertado se basa en la información suministrada por el cliente respecto al lugar de entrega. Cualquier cambio en la dirección podrá afectar el precio.</li>
        <li>Esta propuesta comercial tiene una vigencia de 30 días contados a partir de su fecha de emisión.</li>
        <li><strong>Información Adicional:</strong> Para mayor información visitar: <a href="https://meup.co/terminos#preguntas">https://meup.co/terminos#preguntas</a></li>
        <li><strong>Cambios y Devoluciones:</strong> Solo se aceptan devoluciones o cambios por defectos de fabricación.</li>
        <li><strong>Productos importados en tránsito:</strong> Los productos importados pueden retrasarse por fuerza mayor o situaciones fuera del control de la empresa.</li>
      </ol>

      <p className="cierre">Quedamos a su disposición para cualquier consulta adicional y agradecemos la oportunidad de ser parte de sus proyectos.</p>

      {/* FOOTER */}
      <div className="footer">
        <img src={logoMeUp} alt="MeUp" className="logo-footer" />
        <p className="claim">El toque natural para tus proyectos</p>
      </div>
    </div>
  );
}
