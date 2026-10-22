"use strict";var xe=Object.create;var T=Object.defineProperty;var Ce=Object.getOwnPropertyDescriptor;var ke=Object.getOwnPropertyNames;var Pe=Object.getPrototypeOf,Se=Object.prototype.hasOwnProperty;var Re=(r,e)=>{for(var t in e)T(r,t,{get:e[t],enumerable:!0})},B=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of ke(e))!Se.call(r,n)&&n!==t&&T(r,n,{get:()=>e[n],enumerable:!(o=Ce(e,n))||o.enumerable});return r};var s=(r,e,t)=>(t=r!=null?xe(Pe(r)):{},B(e||!r||!r.__esModule?T(t,"default",{value:r,enumerable:!0}):t,r)),Ee=r=>B(T({},"__esModule",{value:!0}),r);var je={};Re(je,{activate:()=>Oe,deactivate:()=>Ye});module.exports=Ee(je);var E=s(require("vscode"));var ae=s(require("vscode"));var q=s(require("vscode"));var W=s(require("vscode"));var V=s(require("vscode"));var C="https://bagui.pro",_=["marketing","dashboard","authentication","forms","buttons","cards","navigation","templates"],Ie={marketing:"Marketing",dashboard:"Dashboard",authentication:"Authentication",forms:"Forms",buttons:"Buttons",cards:"Cards",navigation:"Navigation",templates:"Templates",favorites:"Favorites"},Te=[[/template/,"templates"],[/dashboard|chat-app|analytics/,"dashboard"],[/login|register|signin|signup|auth|password/,"authentication"],[/contact|form|input/,"forms"],[/button/,"buttons"],[/navbar|sidebar|footer|menu|nav/,"navigation"],[/card/,"cards"],[/hero|cta|faq|pricing|feature|testimonial|team/,"marketing"]];function De(r){let e=`${r.name} ${r.title}`.toLowerCase();for(let[t,o]of Te)if(t.test(e))return o;return"marketing"}function y(r){let e=Ie[r.toLowerCase()];return e||r.charAt(0).toUpperCase()+r.slice(1)}function Y(r,e){let t=o=>{let n=_.indexOf(o);return n===-1?_.length:n};return t(r)-t(e)||r.localeCompare(e)}function D(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}function m(r){return typeof r=="string"&&r.trim().length>0?r:void 0}function O(r){return Array.isArray(r)?r.filter(e=>typeof e=="string"):void 0}function Ne(r){return D(r)&&r.tier==="pro"?"pro":"free"}function z(r){return/^[a-z0-9][a-z0-9._-]*$/i.test(r)}function $e(r){if(!D(r))return;let e=m(r.name);if(!e||!z(e))return;let t=m(r.type)??"registry:block",o=m(r.title)??e,n=Ne(r.access),i=Array.isArray(r.files)?r.files.filter(D).flatMap(l=>{let I=m(l.path);return I?[{path:I,type:m(l.type)??t,target:m(l.target)}]:[]}):[],a={name:e,type:t,title:o,description:m(r.description)??"",files:i,dependencies:O(r.dependencies),access:{tier:n},tags:O(r.tags),version:m(r.version),docsUrl:m(r.docsUrl),image:m(r.image),category:m(r.category)},d=(a.category??De(a)).toLowerCase(),u=a.tags??[t.replace("registry:",""),n];return{...a,category:d,tags:u,tier:n}}function j(r){if(!D(r)||!Array.isArray(r.items))throw new Error('Invalid registry: expected an object with an "items" array.');let e=r.items.flatMap(t=>{let o=$e(t);return o?[o]:[]});if(e.length===0&&r.items.length>0)throw new Error("Invalid registry: no valid component found.");return{name:m(r.name)??"BagUI",homepage:(m(r.homepage)??C).replace(/\/+$/,""),components:e}}function H(r){return{label:r.title,description:r.description,detail:`${y(r.category)} \u2022 ${r.tier==="pro"?"Pro":"Free"}`,alwaysShow:!0,component:r}}async function K(r,e){let t=V.window.createQuickPick();t.placeholder=e,t.matchOnDescription=!0,t.matchOnDetail=!0,t.busy=!0,t.show();try{t.items=(await r.getComponents()).map(H)}catch(o){throw t.dispose(),o}return t.busy=!1,new Promise(o=>{let n=[],i=!1,a=d=>{i||(i=!0,o(d),n.forEach(u=>u.dispose()),t.dispose())};n.push(t.onDidChangeValue(async d=>{try{t.items=(await r.search(d)).map(H)}catch{t.items=[]}}),t.onDidAccept(()=>a(t.selectedItems[0]?.component)),t.onDidHide(()=>a(void 0)))})}function G(r){if(typeof r=="string"&&r.length>0)return r;if(typeof r!="object"||r===null)return;let e=r;return e.kind==="component"&&e.component?e.component.name:typeof e.name=="string"?e.name:void 0}function w(r,e){return r instanceof Error&&r.message?r.message:e}async function g(r,e){try{await r()}catch(t){W.window.showErrorMessage(w(t,e))}}async function h(r,e,t){let o=G(e);if(o){let n=await r.registry.getComponent(o);if(!n)throw new Error(`Component "${o}" was not found in the BagUI registry.`);return n}return K(r.registry,t)}function J(r,e){return g(async()=>{let t=await h(r,e,"Select a component to add to favorites");t&&(await r.favorites.add(t.name),q.window.showInformationMessage(`Added ${t.title} to favorites.`))},"Unable to add this component to favorites.")}function Q(r,e){return g(async()=>{let t=await h(r,e,"Select a favorite to remove");t&&await r.favorites.remove(t.name)},"Unable to remove this component from favorites.")}var X=s(require("vscode"));function Z(r,e){return g(async()=>{let t=await h(r,e,"Select a BagUI component to install");t&&(await r.installer.install(t,await r.registry.getHomepage()),X.window.showInformationMessage(`Installing ${t.title}\u2026`))},"Unable to install this component.")}function ee(r,e){return g(async()=>{let t=await r.registry.getHomepage(),o=e===void 0?void 0:await h(r,e,"");await r.installer.openDocumentation(o,t)},"Unable to open the documentation.")}var te=s(require("vscode"));function re(){return g(async()=>{await te.commands.executeCommand("workbench.view.extension.bagui")},"Unable to open BagUI.")}var k=s(require("vscode"));function oe(r){return g(async()=>{await k.window.withProgress({location:k.ProgressLocation.Window,title:"BagUI: refreshing registry\u2026"},()=>r.registry.refresh()),k.window.showInformationMessage("BagUI registry refreshed.")},"Unable to refresh the BagUI registry.")}function ne(r){return g(async()=>{let e=await h(r,void 0,"Search BagUI components");e&&await r.preview.show(e)},"Unable to search BagUI components.")}function ie(r,e){return g(async()=>{let t=await h(r,e,"Select a BagUI component to preview");t&&await r.preview.show(t)},"Unable to preview this component.")}function se(r){let e=(t,o)=>ae.commands.registerCommand(t,n=>o(n));return[e("bagui.open",()=>re()),e("bagui.searchComponent",()=>ne(r)),e("bagui.refreshRegistry",()=>oe(r)),e("bagui.installComponent",t=>Z(r,t)),e("bagui.openDocumentation",t=>ee(r,t)),e("bagui.preview",t=>ie(r,t)),e("bagui.addFavorite",t=>J(r,t)),e("bagui.removeFavorite",t=>Q(r,t))]}var c=s(require("vscode"));var P="favorites";var N=class{constructor(e,t){this.registry=e;this.favorites=t;this.subscriptions.push(this._onDidChangeTreeData,e.onDidChange(()=>this.refresh()),t.onDidChange(()=>this.refresh()),c.workspace.onDidChangeConfiguration(o=>{o.affectsConfiguration("bagui")&&this.refresh()}))}_onDidChangeTreeData=new c.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;subscriptions=[];dispose(){this.subscriptions.forEach(e=>e.dispose())}refresh(){this._onDidChangeTreeData.fire()}async getChildren(e){try{return e?e.kind==="category"?await this.getCategoryChildren(e):[]:await this.getRoots()}catch(t){return c.window.showErrorMessage(w(t,"Unable to load BagUI components.")),[]}}getTreeItem(e){if(e.kind==="category"){let d=new c.TreeItem(e.label,c.TreeItemCollapsibleState.Collapsed);return d.id=`category/${e.category}`,d.contextValue="category",d.description=String(e.count),d.iconPath=new c.ThemeIcon(e.category===P?"star-full":"folder"),d}let{component:t,parent:o,isFavorite:n}=e,i=new c.TreeItem(t.title,c.TreeItemCollapsibleState.None);return i.id=`${o}/${t.name}`,i.contextValue=n?"component.favorite":"component",i.description=t.tier==="pro"?"Pro":void 0,i.tooltip=new c.MarkdownString(`**${t.title}**

${t.description}`),i.iconPath=new c.ThemeIcon(n?"star-full":"symbol-misc"),c.workspace.getConfiguration("bagui").get("autoPreview",!0)&&(i.command={command:"bagui.preview",title:"Preview Component",arguments:[t.name]}),i}async getRoots(){let[e,t]=await Promise.all([this.registry.getCategories(),this.registry.getComponents()]),o={kind:"category",category:P,label:y(P),count:t.filter(i=>this.favorites.has(i.name)).length},n=e.map(i=>({kind:"category",category:i,label:y(i),count:t.filter(a=>a.category===i).length}));return[o,...n]}async getCategoryChildren(e){return(e.category===P?(await this.registry.getComponents()).filter(o=>this.favorites.has(o.name)):await this.registry.getComponentsByCategory(e.category)).map(o=>({kind:"component",parent:e.category,component:o,isFavorite:this.favorites.has(o.name)}))}};var b=class r{constructor(e){this.context=e}static TTL_MS=12*60*60*1e3;static KEY="bagui.registry.cache.v1";getFresh(e){let t=this.read(e);return t&&Date.now()-t.timestamp<r.TTL_MS?t.registry:void 0}getStale(e){return this.read(e)?.registry}async save(e,t){let o={sourceId:e,timestamp:Date.now(),registry:t};await this.context.globalState.update(r.KEY,o)}async clear(){await this.context.globalState.update(r.KEY,void 0)}read(e){let t=this.context.globalState.get(r.KEY);return t&&t.sourceId===e?t:void 0}};var ce=s(require("vscode")),$=class r{constructor(e){this.context=e;this.context.globalState.setKeysForSync([r.KEY])}static KEY="bagui.favorites";_onDidChange=new ce.EventEmitter;onDidChange=this._onDidChange.event;dispose(){this._onDidChange.dispose()}list(){return this.context.globalState.get(r.KEY,[])}has(e){return this.list().includes(e)}async add(e){this.has(e)||await this.save([...this.list(),e])}async remove(e){this.has(e)&&await this.save(this.list().filter(t=>t!==e))}async save(e){await this.context.globalState.update(r.KEY,e),this._onDidChange.fire()}};var de=s(require("node:fs")),pe=s(require("node:path")),f=s(require("vscode"));function Ue(r,e){return`${e.replace(/\/+$/,"")}/r/${r}.json`}function L(r,e,t="npm"){if(!z(r))throw new Error(`Refusing to build an install command for an unsafe component name: ${r}`);let o=Ue(r,e);switch(t){case"pnpm":return`pnpm dlx shadcn@latest add ${o}`;case"yarn":return`yarn dlx shadcn@latest add ${o}`;case"bun":return`bunx --bun shadcn@latest add ${o}`;default:return`npx shadcn@latest add ${o}`}}var Ae="BagUI",U=class{async getCommand(e,t=C){let o=f.workspace.workspaceFolders?.[0],n=o?this.detectPackageManager(o.uri.fsPath):"npm";return L(e.name,t,n)}async install(e,t=C){let o=f.workspace.workspaceFolders;if(!o||o.length===0)throw new Error("No workspace is opened. Open a project folder before installing a component.");let n=o.length===1?o[0]:await f.window.showWorkspaceFolderPick({placeHolder:"Select the project to install the component into"});if(!n)return;let i=L(e.name,t,this.detectPackageManager(n.uri.fsPath)),a=this.getTerminal(n);try{a.show(!0),a.sendText(i,!0)}catch{throw await f.env.clipboard.writeText(i),new Error(`The terminal is unavailable. The command was copied to your clipboard: ${i}`)}}async openDocumentation(e,t=C){let o=e?.docsUrl??`${t.replace(/\/+$/,"")}/docs`;if(!await f.env.openExternal(f.Uri.parse(o)))throw new Error(`Unable to open ${o}`)}getTerminal(e){let t=`${Ae}: ${e.name}`;return f.window.terminals.find(n=>n.name===t&&n.exitStatus===void 0)??f.window.createTerminal({name:t,cwd:e.uri})}detectPackageManager(e){let t=o=>de.existsSync(pe.join(e,o));return t("pnpm-lock.yaml")?"pnpm":t("yarn.lock")?"yarn":t("bun.lockb")||t("bun.lock")?"bun":"npm"}};var ue=s(require("node:path")),x=s(require("vscode"));var me=s(require("node:fs")),ge=s(require("node:path"));var S=class{constructor(e){this.filePath=e}cacheable=!1;get id(){return`file:${this.filePath}`}async load(){let e;try{e=await me.promises.readFile(this.filePath,"utf8")}catch{throw new Error(`BagUI registry file not found or unreadable: ${this.filePath}`)}return le(e,this.filePath)}},A=class{constructor(e,t=1e4){this.url=e;this.timeoutMs=t}cacheable=!0;get id(){return`http:${this.url}`}async load(){let e=new AbortController,t=setTimeout(()=>e.abort(),this.timeoutMs);try{let o=await fetch(this.url,{signal:e.signal,headers:{Accept:"application/json"}});if(!o.ok)throw new Error(`HTTP ${o.status}`);return le(await o.text(),this.url)}catch(o){let n=o instanceof Error?o.message:"unknown error";throw new Error(`Unable to fetch the BagUI registry from ${this.url} (${n}).`)}finally{clearTimeout(t)}}},R=class{constructor(e){this.context=e}id="bundled";cacheable=!1;async load(){let e=ge.join(this.context.extensionPath,"data","registry.json");return new S(e).load()}};function le(r,e){let t;try{t=JSON.parse(r)}catch{throw new Error(`Invalid BagUI registry (malformed JSON): ${e}`)}return j(t)}var Me=Number.POSITIVE_INFINITY,fe=5*60*1e3,M=class{constructor(e,t){this.context=e;this.cache=t}_onDidChange=new x.EventEmitter;onDidChange=this._onDidChange.event;inflight;current;currentSourceId="";expiresAt=0;offlineNoticeShown=!1;dispose(){this._onDidChange.dispose()}async getCategories(){let{components:e}=await this.getRegistry();return Array.from(new Set(e.map(t=>t.category))).sort(Y)}async getComponents(){return(await this.getRegistry()).components}async getComponent(e){return(await this.getComponents()).find(o=>o.name===e)}async getComponentsByCategory(e){return(await this.getComponents()).filter(o=>o.category===e)}async search(e){let t=await this.getComponents(),o=e.trim().toLowerCase().split(/\s+/).filter(Boolean);return o.length===0?t:t.filter(n=>{let i=[n.title,n.description,n.name,n.category,...n.tags].join(" ").toLowerCase();return o.every(a=>i.includes(a))})}async getHomepage(){return(await this.getRegistry()).homepage}async refresh(){await this.cache.clear(),this.current=void 0,this.inflight=void 0,this.offlineNoticeShown=!1,await this.getRegistry(),this._onDidChange.fire()}async getRegistry(){let e=this.resolveSource();return this.current&&this.currentSourceId===e.id&&Date.now()<this.expiresAt?this.current:(this.inflight??=this.load(e).finally(()=>{this.inflight=void 0}),this.inflight)}remember(e,t,o){return this.current=t,this.currentSourceId=e.id,this.expiresAt=Date.now()+o,t}async load(e){if(e.cacheable){let t=this.cache.getFresh(e.id);if(t)return this.remember(e,t,b.TTL_MS)}try{let t=await e.load();return e.cacheable&&await this.cache.save(e.id,t),this.remember(e,t,e.cacheable?b.TTL_MS:Me)}catch(t){return this.loadFallback(e,t)}}async loadFallback(e,t){let o=e.cacheable?this.cache.getStale(e.id):void 0;if(o)return this.notifyOffline(t,"cached copy"),this.remember(e,o,fe);if(e.id!=="bundled")try{let n=await new R(this.context).load();return this.notifyOffline(t,"registry bundled with the extension"),this.remember(e,n,fe)}catch{}throw new Error(w(t,"Unable to load the BagUI registry."))}notifyOffline(e,t){this.offlineNoticeShown||(this.offlineNoticeShown=!0,x.window.showWarningMessage(`${w(e,"BagUI registry unavailable.")} Using the ${t} instead.`))}resolveSource(){let e=x.workspace.getConfiguration("bagui"),t=e.get("registryPath","").trim(),o=e.get("apiUrl","").trim();if(t){let n=x.workspace.workspaceFolders?.[0]?.uri.fsPath??process.cwd();return new S(ue.resolve(n,t))}if(o){if(!/^https:\/\//i.test(o))throw new Error('The "bagui.apiUrl" setting must be an https:// URL.');return new A(o)}return new R(this.context)}};var p=s(require("vscode"));var Fe={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function v(r){return r.replace(/[&<>"']/g,e=>Fe[e]??e)}function he(){let r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e="";for(let t=0;t<32;t+=1)e+=r.charAt(Math.floor(Math.random()*r.length));return e}function ve(r){return/^https:\/\//i.test(r)||/^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(r)}function ze(r){if(typeof r!="object"||r===null)return!1;let e=r.type;return e==="install"||e==="copy-cli"||e==="docs"}var Le=`
  --bg: #f8fafc; --surface: rgba(255,255,255,0.88); --surface-strong: #ffffff; --surface-alt: #f1f5f9; --border: rgba(148,163,184,0.35);
  --text: #0f172a; --muted: #475569; --hero: linear-gradient(135deg, #ffffff 0%, #f5f3ff 38%, #ecfeff 100%);
  --shadow: 0 18px 42px rgba(15,23,42,0.08); --ring: rgba(124,58,237,0.22); --accent: #7c3aed; --accent-2: #4f46e5;`,Be=`
  --bg: #020817; --surface: rgba(15,23,42,0.86); --surface-strong: #0f172a; --surface-alt: #111827; --border: rgba(148,163,184,0.22);
  --text: #e2e8f0; --muted: #94a3b8; --hero: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(76,29,149,0.9) 100%);
  --shadow: 0 20px 50px rgba(2,6,23,0.38); --ring: rgba(168,85,247,0.32); --accent: #8b5cf6; --accent-2: #4f46e5;`,_e=`
  --bg: var(--vscode-editor-background); --surface: color-mix(in srgb, var(--vscode-editorWidget-background, var(--vscode-editor-background)) 90%, transparent); --surface-strong: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  --surface-alt: var(--vscode-input-background); --border: var(--vscode-widget-border, var(--vscode-panel-border, rgba(128,128,128,.35)));
  --text: var(--vscode-foreground); --muted: var(--vscode-descriptionForeground); --hero: linear-gradient(135deg, color-mix(in srgb, var(--vscode-editor-background) 80%, #7c3aed) 0%, color-mix(in srgb, var(--vscode-editor-background) 70%, #4f46e5) 100%);
  --shadow: 0 20px 48px rgba(15,23,42,0.18); --ring: rgba(124,58,237,0.28); --accent: color-mix(in srgb, var(--vscode-foreground) 8%, #7c3aed); --accent-2: #4f46e5;`,F=class{constructor(e,t,o){this.context=e;this.registry=t;this.installer=o}panel;current;dispose(){this.panel?.dispose()}async show(e){this.current=e;let t=await this.registry.getHomepage(),o=await this.installer.getCommand(e,t);this.panel||(this.panel=this.createPanel()),this.panel.title=e.title,this.panel.webview.html=this.render(this.panel.webview,e,o),this.panel.reveal(p.ViewColumn.Beside,!0)}createPanel(){let e=p.window.createWebviewPanel("baguiPreview","BagUI",{viewColumn:p.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,localResourceRoots:[p.Uri.joinPath(this.context.extensionUri,"media")]});return e.onDidDispose(()=>{this.panel=void 0,this.current=void 0}),e.webview.onDidReceiveMessage(async t=>{let o=this.current;if(!(!o||!ze(t)))switch(t.type){case"install":await p.commands.executeCommand("bagui.installComponent",o.name);break;case"copy-cli":await p.env.clipboard.writeText(await this.installer.getCommand(o,await this.registry.getHomepage())),p.window.showInformationMessage(`CLI command copied for ${o.title}`);break;case"docs":await p.commands.executeCommand("bagui.openDocumentation",o.name);break}}),e}render(e,t,o){let n=he(),i=p.workspace.getConfiguration("bagui").get("theme","system"),a=i==="dark"?Be:i==="light"?Le:_e,d=i==="dark"?"dark":i==="light"?"light":"light dark",u=t.tier==="pro",l=v(t.title),I=["default-src 'none'",`img-src ${e.cspSource} https: data:`,`style-src 'nonce-${n}'`,`script-src 'nonce-${n}'`].join("; "),ye=t.image&&ve(t.image)?`<img src="${v(t.image)}" alt="${l}" />`:`<div class="placeholder" role="img" aria-label="${l}"><span>${l}</span></div>`,we=t.tags.map(be=>`<span class="pill">${v(be)}</span>`).join("");return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="${I}" />
  <title>${l}</title>
  <style nonce="${n}">
    :root { color-scheme: ${d}; ${a}; }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0; padding: 0; background:
        radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 30%),
        radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.12), transparent 28%),
        var(--bg);
      color: var(--text);
      font-family: var(--vscode-font-family, system-ui, sans-serif);
      line-height: 1.5;
    }
    .shell {
      max-width: 980px; margin: 0 auto; padding: 28px 24px 32px; display: grid; gap: 18px;
    }
    .hero {
      border-radius: 24px; padding: 26px 28px 24px; background: var(--hero); border: 1px solid var(--border);
      box-shadow: var(--shadow); overflow: hidden; position: relative;
    }
    .hero::before {
      content: ""; position: absolute; inset: 0 auto auto 0; width: 180px; height: 180px;
      background: rgba(255,255,255,0.28); border-radius: 999px; filter: blur(28px);
      transform: translate(-20%, -20%);
    }
    .hero > * { position: relative; z-index: 1; }
    .badge {
      display: inline-flex; align-items: center; justify-content: center; padding: 5px 12px; border-radius: 9999px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
      box-shadow: 0 8px 18px rgba(124, 58, 237, 0.25);
    }
    .hero h1 { margin: 14px 0 8px; font-size: clamp(30px, 4vw, 42px); line-height: 1.1; letter-spacing: -0.04em; }
    .hero p { margin: 0 0 20px; color: var(--muted); max-width: 62ch; font-size: 15px; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; }
    button {
      appearance: none; border: 1px solid var(--border); padding: 10px 16px; border-radius: 12px; cursor: pointer;
      font: inherit; font-weight: 600; background: rgba(255,255,255,0.55); color: var(--text);
      box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset; backdrop-filter: blur(8px);
    }
    button:hover { filter: brightness(1.06); }
    button:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
    button.primary {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%); border-color: transparent; color: #fff;
      box-shadow: 0 12px 22px rgba(124, 58, 237, 0.25);
    }
    .grid { display: grid; gap: 18px; grid-template-columns: 1.35fr 0.95fr; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    .card {
      border-radius: 20px; padding: 18px 18px 16px; background: var(--surface); border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }
    .card h2 {
      margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
    }
    img, .placeholder {
      display: block; width: 100%; border-radius: 16px; max-height: 280px; object-fit: cover; overflow: hidden;
      border: 1px solid var(--border); background: var(--surface-alt); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }
    .placeholder {
      height: 220px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 18px;
      font-weight: 700; font-size: 18px; color: #fff; background: linear-gradient(135deg, #4f46e5, #8b5cf6);
    }
    dl {
      margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 10px 18px; align-items: center;
    }
    dt { color: var(--muted); font-size: 13px; }
    dd { margin: 0; font-weight: 600; text-align: right; word-break: break-word; }
    .pills { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
    .pill {
      display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
      background: var(--surface-alt); border: 1px solid var(--border); color: var(--text);
    }
    code {
      display: block; padding: 12px 14px; border-radius: 12px; background: rgba(15, 23, 42, 0.02); border: 1px solid var(--border);
      font-family: var(--vscode-editor-font-family, monospace); font-size: 12px; overflow-x: auto; white-space: nowrap;
      color: var(--text);
    }
    @media (prefers-color-scheme: dark) {
      code { background: rgba(148, 163, 184, 0.08); }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <span class="badge">${u?"Pro":"Free"}</span>
      <h1>${l}</h1>
      <p>${v(t.description)}</p>
      <div class="actions">
        <button class="primary" data-action="install">Install</button>
        <button data-action="copy-cli">Copy CLI</button>
        <button data-action="docs">Open Documentation</button>
      </div>
    </section>
    <section class="grid">
      <div class="card"><h2>Preview</h2>${ye}</div>
      <div class="card">
        <h2>Details</h2>
        <dl>
          <dt>Category</dt><dd>${v(y(t.category))}</dd>
          <dt>Version</dt><dd>${v(t.version??"1.0.0")}</dd>
          <dt>Plan</dt><dd>${u?"Pro":"Free"}</dd>
        </dl>
        <div class="pills">${we}</div>
      </div>
    </section>
    <section class="card"><h2>Install command</h2><code>${v(o)}</code></section>
  </main>
  <script nonce="${n}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => vscode.postMessage({ type: button.getAttribute("data-action") }));
    });
  </script>
</body>
</html>`}};function Oe(r){let e=new b(r),t=new M(r,e),o=new $(r),n=new U,i=new F(r,t,n),a=new N(t,o),d=E.window.createTreeView("bagui.components",{treeDataProvider:a,showCollapseAll:!0});r.subscriptions.push(t,o,i,a,d,...se({registry:t,installer:n,favorites:o,preview:i}),E.workspace.onDidChangeConfiguration(u=>{(u.affectsConfiguration("bagui.registryPath")||u.affectsConfiguration("bagui.apiUrl"))&&t.refresh().catch(l=>{E.window.showErrorMessage(l instanceof Error?l.message:"Unable to load the BagUI registry.")})}))}function Ye(){}0&&(module.exports={activate,deactivate});
