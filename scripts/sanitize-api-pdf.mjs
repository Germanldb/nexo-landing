import fs from 'fs';

const input = 'NEXO-API-Documentacion.extracted.txt';
const output = 'src/data/nexo-api-reference.md';

let text = fs.readFileSync(input, 'utf8');

const replacements = [
  [/N E X O · M I K R O W I S P/gi, 'NEXO'],
  [/Mikrowisp 6\.x \+ módulos NEXO/gi, 'Nexo (núcleo + módulos)'],
  [/Mikrowisp API Reference/gi, 'Nexo API Reference'],
  [/SmartOLT \/ Mikrowisp/gi, 'SmartOLT / Nexo'],
  [/Mikrowisp core/gi, 'API v1 (núcleo)'],
  [/Mikrowisp v1/gi, 'API v1'],
  [/\(Mikrowisp\)/gi, '(API v1)'],
  [/Mikrowisp\)/gi, 'Nexo)'],
  [/Núcleo Mikrowisp/gi, 'API v1 (núcleo Nexo)'],
  [/núcleo oficial de Mikrowisp/gi, 'API v1 legacy del núcleo Nexo'],
  [/documentación oficial de Mikrowisp/gi, 'documentación de comandos v1 en el panel del operador'],
  [/sobre Mikrowisp/gi, 'sobre el núcleo Nexo'],
  [/construida sobre Mikrowisp/gi, ''],
  [/NEXO es la capa de gestión ISP construida sobre el núcleo Nexo\./gi, 'Nexo es la plataforma de gestión para ISPs.'],
  [/documentada por Mikrowisp es/gi, 'documentada para Nexo es'],
  [/admitidas por Mikrowisp:/gi, 'admitidas por Nexo:'],
  [/aunque Mikrowisp los documenta/gi, 'aunque existen en otras ediciones del producto'],
  [/administrador Mikrowisp/gi, 'operador administrador Nexo'],
  [/ModulosMikrowisp/g, 'módulo de facturación Nexo'],
  [/Mikrowisp documenta/gi, 'Nexo documenta'],
  [/Mikrowisp puede/gi, 'Nexo puede'],
  [/Mikrowisp los genera/gi, 'Nexo los genera'],
  [/Mikrowisp admite/gi, 'Nexo admite'],
  [/vía Mikrowisp/gi, 'vía API v1'],
  [/a través de Mikrowisp/gi, 'a través de la API v1 de Nexo'],
  [/Scripts de Mikrowisp \(ionCube\)/gi, 'Scripts de recaudación (ionCube)'],
  [/llms\.txt de Mikrowisp/gi, 'documentación del proveedor'],
  [/referencia oficial Mikrowisp API v1\.1/gi, 'referencia API v1 Nexo'],
  [/docs\.mikrosystem\.net/gi, 'esta documentación'],
  [/v11 \(Mikrowisp\)/gi, 'v11 (API v1)'],
  [/https:\/\/vente\.rsgve\.com/g, ' .com'],
  [/vente\.rsgve\.com/g, 'tu-dominio.com'],
  [/Confidencial · Uso interno y de integradores autorizados Página \d+ de \d+\n?/g, ''],
  [/API NEXO · Documentación de referencia tu-dominio\.com\n?/g, ''],
  [/-- \d+ of \d+ --\n?/g, '\n'],
  [/tablalogin/g, 'tabla `login`'],
  [/dura3600/g, 'dura 3600'],
  [/objetouser/g, 'objeto `user`'],
  [/contiene dos puntos \(xxx\.yyy\.zzz\)/g, 'tiene forma JWT (tres segmentos separados por punto)'],
  [/congetMovement/g, 'con getMovement'],
  [/conestado: error/g, 'con estado: error'],
  [/llega por query, form o JSON\. Consulta a Serdimpre; en etapa 4 \(Facturado\)/g, 'llega por query, form o JSON. Consulta a Serdimpre; en etapa 4 (Facturado)'],
  [/headerx-api-key/g, 'header x-api-key'],
  [/pasarelatipo/g, 'pasarela tipo'],
  [/isserdimpre/g, 'is serdimpre'],
  [/operador = id login/g, 'operador = id de login'],
  [/perfilesiptv/g, 'perfiles IPTV'],
  [/luegorequest_otp/g, 'luego request_otp'],
];

for (const [re, sub] of replacements) {
  text = text.replace(re, sub);
}

// Drop PDF meta block about "convertir PDF" first pages noise - keep from section 2
const start = text.indexOf('1. Cómo usar este documento');
const intro = `# Referencia API Nexo

Documentación completa de endpoints, autenticación, webhooks y recaudadores. Sustituya \` .com\` por el host de su instalación.

`;

const body = start >= 0 ? text.slice(start) : text;

function prefixEndpointHeadings(source) {
  return (
    source
      // Orden: variantes compuestas antes que GET/POST sueltos
      .replace(/^WEBHOOK GET\s+\/\s*POST\s+/gm, '\n#### WEBHOOK GET/POST ')
      .replace(/^WEBHOOK POST\s+/gm, '\n#### WEBHOOK POST ')
      .replace(/^GET\s+\/\s*PUT\s+\/\s*POST\s+/gm, '\n#### GET/PUT/POST ')
      .replace(/^GET\s+\/\s*POST\s+/gm, '\n#### GET/POST ')
      .replace(/^POST\s+\/(facilito|puntoagil|evertec)\S[^\n]*/gm, (line) => `\n#### ${line.trim()}`)
      .replace(/^POST\s+\/api/gm, '\n#### POST /api')
      .replace(
        /^GET\s+\/api(?!\/v2\/consultafactura\?cedula=)(?!\/v2\/facturacion responde)/gm,
        '\n#### GET /api',
      )
      .replace(/^PUT\s+\/api/gm, '\n#### PUT /api')
      .replace(/^DELETE\s+\/api/gm, '\n#### DELETE /api')
      .replace(/^SOAP \/bancoestado\/web\/\?wsdl[^\n]*/gm, (line) => `\n#### ${line.trim()}`)
  );
}

const md = intro + prefixEndpointHeadings(
  body
    .replace(/^(\d+)\. (.+)$/gm, '## $1. $2')
    .replace(/^(\d+\.\d+) (.+)$/gm, '### $1 $2')
    .replace(/^SmartOLT \(vía Nexo\)\s*$/gm, '\n### SmartOLT (vía Nexo)\n'),
)
  .replace(/\n{4,}/g, '\n\n\n')
  .trim();

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync(output, md, 'utf8');
console.log(`Wrote ${output} (${md.length} chars)`);
