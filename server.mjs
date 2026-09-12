import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff'};
export const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 if(req.url?.split('?')[0]==='/healthz'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:JSON.stringify({status:'ok',version:'0.11.0'}));return;}
 try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname.includes('\0'))throw Error('path');let path=resolve(root,'.'+pathname);if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
 let info;try{info=await stat(path);}catch{}if(!info?.isFile()){if(extname(pathname)){res.writeHead(404);res.end('Not found');return;}path=resolve(root,'index.html');info=await stat(path);}
 res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','Content-Length':info.size,'Cache-Control':path.endsWith('.html')?'no-cache':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'public, max-age=3600','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"});if(req.method==='HEAD'){res.end();return;}const stream=createReadStream(path);stream.on('error',()=>res.destroy());stream.pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
});
if(process.env.NODE_ENV!=='test')server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Paperbound server ready'));
