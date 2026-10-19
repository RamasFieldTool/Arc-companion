// Optional transport setup for review environments that require an HTTP proxy.
// No routes, response fixtures, TLS-wide exceptions or suppressed test errors.
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import {X509Certificate,createHash} from 'node:crypto';
const proxyUrl=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
if(!proxyUrl)throw new Error('review-network-proxy requires HTTPS_PROXY or HTTP_PROXY');
const args=['--proxy-server='+proxyUrl,'--proxy-bypass-list=localhost;127.0.0.1'];
if(process.env.SSL_CERT_FILE){
 const certificate=new X509Certificate(await readFile(process.env.SSL_CERT_FILE));
 const spki=certificate.publicKey.export({type:'spki',format:'der'});
 const pin=createHash('sha256').update(spki).digest('base64');
 args.push('--ignore-certificate-errors-spki-list='+pin);
}
const launch=chromium.launch.bind(chromium);
chromium.launch=options=>launch({...options,args:[...(options?.args||[]),...args]});
