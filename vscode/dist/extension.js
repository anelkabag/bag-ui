"use strict";var Se=Object.create;var D=Object.defineProperty;var Re=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames;var $e=Object.getPrototypeOf,Te=Object.prototype.hasOwnProperty;var Ue=(r,e)=>{for(var t in e)D(r,t,{get:e[t],enumerable:!0})},V=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Ie(e))!Te.call(r,n)&&n!==t&&D(r,n,{get:()=>e[n],enumerable:!(o=Re(e,n))||o.enumerable});return r};var c=(r,e,t)=>(t=r!=null?Se($e(r)):{},V(e||!r||!r.__esModule?D(t,"default",{value:r,enumerable:!0}):t,r)),De=r=>V(D({},"__esModule",{value:!0}),r);var Ke={};Ue(Ke,{activate:()=>Ve,deactivate:()=>qe});module.exports=De(Ke);var T=c(require("vscode"));var ue=c(require("vscode"));var oe=c(require("vscode"));var re=c(require("vscode"));var Z=c(require("vscode"));var C="https://bagui.pro",q=["marketing","dashboard","authentication","forms","buttons","cards","navigation","templates"],Ne={marketing:"Marketing",dashboard:"Dashboard",authentication:"Authentication",forms:"Forms",buttons:"Buttons",cards:"Cards",navigation:"Navigation",templates:"Templates",favorites:"Favorites"},Ae=[[/template/,"templates"],[/dashboard|chat-app|analytics/,"dashboard"],[/login|register|signin|signup|auth|password/,"authentication"],[/contact|form|input/,"forms"],[/button/,"buttons"],[/navbar|sidebar|footer|menu|nav/,"navigation"],[/card/,"cards"],[/hero|cta|faq|pricing|feature|testimonial|team/,"marketing"]];function Me(r){let e=`${r.name} ${r.title}`.toLowerCase();for(let[t,o]of Ae)if(t.test(e))return o;return"marketing"}function h(r){let e=Ne[r.toLowerCase()];return e||r.charAt(0).toUpperCase()+r.slice(1)}function J(r,e){let t=o=>{let n=q.indexOf(o);return n===-1?q.length:n};return t(r)-t(e)||r.localeCompare(e)}function N(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}function g(r){return typeof r=="string"&&r.trim().length>0?r:void 0}function K(r){return Array.isArray(r)?r.filter(e=>typeof e=="string"):void 0}function ze(r){return N(r)&&r.tier==="pro"?"pro":"free"}function W(r){return/^[a-z0-9][a-z0-9._-]*$/i.test(r)}function Le(r){if(!N(r))return;let e=g(r.name);if(!e||!W(e))return;let t=g(r.type)??"registry:block",o=g(r.title)??e,n=ze(r.access),i=Array.isArray(r.files)?r.files.filter(N).flatMap(w=>{let m=g(w.path);return m?[{path:m,type:g(w.type)??t,target:g(w.target)}]:[]}):[],s={name:e,type:t,title:o,description:g(r.description)??"",files:i,dependencies:K(r.dependencies),access:{tier:n},tags:K(r.tags),version:g(r.version),docsUrl:g(r.docsUrl),image:g(r.image),category:g(r.category)},a=(s.category??Me(s)).toLowerCase(),f=s.tags??[t.replace("registry:",""),n];return{...s,category:a,tags:f,tier:n}}function Q(r){if(!N(r)||!Array.isArray(r.items))throw new Error('Invalid registry: expected an object with an "items" array.');let e=r.items.flatMap(t=>{let o=Le(t);return o?[o]:[]});if(e.length===0&&r.items.length>0)throw new Error("Invalid registry: no valid component found.");return{name:g(r.name)??"BagUI",homepage:(g(r.homepage)??C).replace(/\/+$/,""),components:e}}function X(r){return{label:r.title,description:r.description,detail:`${h(r.category)} \u2022 ${r.tier==="pro"?"Pro":"Free"}`,alwaysShow:!0,component:r}}async function ee(r,e){let t=Z.window.createQuickPick();t.placeholder=e,t.matchOnDescription=!0,t.matchOnDetail=!0,t.busy=!0,t.show();try{t.items=(await r.getComponents()).map(X)}catch(o){throw t.dispose(),o}return t.busy=!1,new Promise(o=>{let n=[],i=!1,s=a=>{i||(i=!0,o(a),n.forEach(f=>f.dispose()),t.dispose())};n.push(t.onDidChangeValue(async a=>{try{t.items=(await r.search(a)).map(X)}catch{t.items=[]}}),t.onDidAccept(()=>s(t.selectedItems[0]?.component)),t.onDidHide(()=>s(void 0)))})}function te(r){if(typeof r=="string"&&r.length>0)return r;if(typeof r!="object"||r===null)return;let e=r;return e.kind==="component"&&e.component?e.component.name:typeof e.name=="string"?e.name:void 0}function k(r,e){return r instanceof Error&&r.message?r.message:e}async function u(r,e){try{await r()}catch(t){re.window.showErrorMessage(k(t,e))}}async function b(r,e,t){let o=te(e);if(o){let n=await r.registry.getComponent(o);if(!n)throw new Error(`Component "${o}" was not found in the BagUI registry.`);return n}return ee(r.registry,t)}function ne(r,e){return u(async()=>{let t=await b(r,e,"Select a component to add to favorites");t&&(await r.favorites.add(t.name),oe.window.showInformationMessage(`Added ${t.title} to favorites.`))},"Unable to add this component to favorites.")}function ie(r,e){return u(async()=>{let t=await b(r,e,"Select a favorite to remove");t&&await r.favorites.remove(t.name)},"Unable to remove this component from favorites.")}var ae=c(require("vscode"));function se(r,e){return u(async()=>{let t=await b(r,e,"Select a BagUI component to install");t&&(await r.installer.install(t,await r.registry.getHomepage()),ae.window.showInformationMessage(`Installing ${t.title}\u2026`))},"Unable to install this component.")}function ce(r,e){return u(async()=>{let t=await r.registry.getHomepage(),o=e===void 0?void 0:await b(r,e,"");await r.installer.openDocumentation(o,t)},"Unable to open the documentation.")}var de=c(require("vscode"));function pe(){return u(async()=>{await de.commands.executeCommand("workbench.view.extension.bagui")},"Unable to open BagUI.")}var S=c(require("vscode"));function le(r){return u(async()=>{await S.window.withProgress({location:S.ProgressLocation.Window,title:"BagUI: refreshing registry\u2026"},()=>r.registry.refresh()),S.window.showInformationMessage("BagUI registry refreshed.")},"Unable to refresh the BagUI registry.")}function me(r){return u(async()=>{let e=await b(r,void 0,"Search BagUI components");e&&await r.preview.show(e)},"Unable to search BagUI components.")}function ge(r,e){return u(async()=>{let t=await b(r,e,"Select a BagUI component to preview");t&&await r.preview.show(t)},"Unable to preview this component.")}function fe(r){let e=(t,o)=>ue.commands.registerCommand(t,n=>o(n));return[e("bagui.open",()=>pe()),e("bagui.browseComponents",()=>r.gallery.open()),e("bagui.searchComponent",()=>me(r)),e("bagui.refreshRegistry",()=>le(r)),e("bagui.installComponent",t=>se(r,t)),e("bagui.openDocumentation",t=>ce(r,t)),e("bagui.preview",t=>ge(r,t)),e("bagui.addFavorite",t=>ne(r,t)),e("bagui.removeFavorite",t=>ie(r,t))]}var p=c(require("vscode"));var R="favorites";var A=class{constructor(e,t){this.registry=e;this.favorites=t;this.subscriptions.push(this._onDidChangeTreeData,e.onDidChange(()=>this.refresh()),t.onDidChange(()=>this.refresh()),p.workspace.onDidChangeConfiguration(o=>{o.affectsConfiguration("bagui")&&this.refresh()}))}_onDidChangeTreeData=new p.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;subscriptions=[];dispose(){this.subscriptions.forEach(e=>e.dispose())}refresh(){this._onDidChangeTreeData.fire()}async getChildren(e){try{return e?e.kind==="category"?await this.getCategoryChildren(e):[]:await this.getRoots()}catch(t){return p.window.showErrorMessage(k(t,"Unable to load BagUI components.")),[]}}getTreeItem(e){if(e.kind==="category"){let a=new p.TreeItem(e.label,p.TreeItemCollapsibleState.Collapsed);return a.id=`category/${e.category}`,a.contextValue="category",a.description=String(e.count),a.iconPath=new p.ThemeIcon(e.category===R?"star-full":"folder"),a}let{component:t,parent:o,isFavorite:n}=e,i=new p.TreeItem(t.title,p.TreeItemCollapsibleState.None);return i.id=`${o}/${t.name}`,i.contextValue=n?"component.favorite":"component",i.description=t.tier==="pro"?"Pro":void 0,i.tooltip=new p.MarkdownString(`**${t.title}**

${t.description}`),i.iconPath=new p.ThemeIcon(n?"star-full":"symbol-misc"),p.workspace.getConfiguration("bagui").get("autoPreview",!0)&&(i.command={command:"bagui.preview",title:"Preview Component",arguments:[t.name]}),i}async getRoots(){let[e,t]=await Promise.all([this.registry.getCategories(),this.registry.getComponents()]),o={kind:"category",category:R,label:h(R),count:t.filter(i=>this.favorites.has(i.name)).length},n=e.map(i=>({kind:"category",category:i,label:h(i),count:t.filter(s=>s.category===i).length}));return[o,...n]}async getCategoryChildren(e){return(e.category===R?(await this.registry.getComponents()).filter(o=>this.favorites.has(o.name)):await this.registry.getComponentsByCategory(e.category)).map(o=>({kind:"component",parent:e.category,component:o,isFavorite:this.favorites.has(o.name)}))}};var P=class r{constructor(e){this.context=e}static TTL_MS=12*60*60*1e3;static KEY="bagui.registry.cache.v1";getFresh(e){let t=this.read(e);return t&&Date.now()-t.timestamp<r.TTL_MS?t.registry:void 0}getStale(e){return this.read(e)?.registry}async save(e,t){let o={sourceId:e,timestamp:Date.now(),registry:t};await this.context.globalState.update(r.KEY,o)}async clear(){await this.context.globalState.update(r.KEY,void 0)}read(e){let t=this.context.globalState.get(r.KEY);return t&&t.sourceId===e?t:void 0}};var he=c(require("vscode")),M=class r{constructor(e){this.context=e;this.context.globalState.setKeysForSync([r.KEY])}static KEY="bagui.favorites";_onDidChange=new he.EventEmitter;onDidChange=this._onDidChange.event;dispose(){this._onDidChange.dispose()}list(){return this.context.globalState.get(r.KEY,[])}has(e){return this.list().includes(e)}async add(e){this.has(e)||await this.save([...this.list(),e])}async remove(e){this.has(e)&&await this.save(this.list().filter(t=>t!==e))}async save(e){await this.context.globalState.update(r.KEY,e),this._onDidChange.fire()}};var ve=c(require("node:fs")),ye=c(require("node:path")),v=c(require("vscode"));function Be(r,e){return`${e.replace(/\/+$/,"")}/r/${r}.json`}function G(r,e,t="npm"){if(!W(r))throw new Error(`Refusing to build an install command for an unsafe component name: ${r}`);let o=Be(r,e);switch(t){case"pnpm":return`pnpm dlx shadcn@latest add ${o}`;case"yarn":return`yarn dlx shadcn@latest add ${o}`;case"bun":return`bunx --bun shadcn@latest add ${o}`;default:return`npx shadcn@latest add ${o}`}}var Fe="BagUI",z=class{async getCommand(e,t=C){let o=v.workspace.workspaceFolders?.[0],n=o?this.detectPackageManager(o.uri.fsPath):"npm";return G(e.name,t,n)}async install(e,t=C){let o=v.workspace.workspaceFolders;if(!o||o.length===0)throw new Error("No workspace is opened. Open a project folder before installing a component.");let n=o.length===1?o[0]:await v.window.showWorkspaceFolderPick({placeHolder:"Select the project to install the component into"});if(!n)return;let i=G(e.name,t,this.detectPackageManager(n.uri.fsPath)),s=this.getTerminal(n);try{s.show(!0),s.sendText(i,!0)}catch{throw await v.env.clipboard.writeText(i),new Error(`The terminal is unavailable. The command was copied to your clipboard: ${i}`)}}async openDocumentation(e,t=C){let o=e?.docsUrl??`${t.replace(/\/+$/,"")}/docs`;if(!await v.env.openExternal(v.Uri.parse(o)))throw new Error(`Unable to open ${o}`)}getTerminal(e){let t=`${Fe}: ${e.name}`;return v.window.terminals.find(n=>n.name===t&&n.exitStatus===void 0)??v.window.createTerminal({name:t,cwd:e.uri})}detectPackageManager(e){let t=o=>ve.existsSync(ye.join(e,o));return t("pnpm-lock.yaml")?"pnpm":t("yarn.lock")?"yarn":t("bun.lockb")||t("bun.lock")?"bun":"npm"}};var ke=c(require("node:path")),E=c(require("vscode"));var we=c(require("node:fs")),be=c(require("node:path"));var I=class{constructor(e){this.filePath=e}cacheable=!1;get id(){return`file:${this.filePath}`}async load(){let e;try{e=await we.promises.readFile(this.filePath,"utf8")}catch{throw new Error(`BagUI registry file not found or unreadable: ${this.filePath}`)}return xe(e,this.filePath)}},$=class{constructor(e,t=1e4){this.url=e;this.timeoutMs=t}cacheable=!0;get id(){return`http:${this.url}`}async load(){let e=new AbortController,t=setTimeout(()=>e.abort(),this.timeoutMs);try{let o=await fetch(this.url,{signal:e.signal,headers:{Accept:"application/json"}});if(!o.ok)throw new Error(`HTTP ${o.status}`);return xe(await o.text(),this.url)}catch(o){let n=o instanceof Error?o.message:"unknown error";throw new Error(`Unable to fetch the BagUI registry from ${this.url} (${n}).`)}finally{clearTimeout(t)}}},L=class{constructor(e){this.context=e}id="bundled";cacheable=!1;async load(){let e=be.join(this.context.extensionPath,"data","registry.json");return new I(e).load()}};function xe(r,e){let t;try{t=JSON.parse(r)}catch{throw new Error(`Invalid BagUI registry (malformed JSON): ${e}`)}return Q(t)}var Oe=Number.POSITIVE_INFINITY,Ce=5*60*1e3,B=class{constructor(e,t){this.context=e;this.cache=t}_onDidChange=new E.EventEmitter;onDidChange=this._onDidChange.event;inflight;current;currentSourceId="";expiresAt=0;offlineNoticeShown=!1;dispose(){this._onDidChange.dispose()}async getCategories(){let{components:e}=await this.getRegistry();return Array.from(new Set(e.map(t=>t.category))).sort(J)}async getComponents(){return(await this.getRegistry()).components}async getComponent(e){return(await this.getComponents()).find(o=>o.name===e)}async getComponentsByCategory(e){return(await this.getComponents()).filter(o=>o.category===e)}async search(e){let t=await this.getComponents(),o=e.trim().toLowerCase().split(/\s+/).filter(Boolean);return o.length===0?t:t.filter(n=>{let i=[n.title,n.description,n.name,n.category,...n.tags].join(" ").toLowerCase();return o.every(s=>i.includes(s))})}async getHomepage(){return(await this.getRegistry()).homepage}async refresh(){await this.cache.clear(),this.current=void 0,this.inflight=void 0,this.offlineNoticeShown=!1,await this.getRegistry(),this._onDidChange.fire()}async getRegistry(){let e=this.resolveSource();return this.current&&this.currentSourceId===e.id&&Date.now()<this.expiresAt?this.current:(this.inflight??=this.load(e).finally(()=>{this.inflight=void 0}),this.inflight)}remember(e,t,o){return this.current=t,this.currentSourceId=e.id,this.expiresAt=Date.now()+o,t}async load(e){if(e.cacheable){let t=this.cache.getFresh(e.id);if(t)return this.remember(e,t,P.TTL_MS)}try{let t=await e.load();return e.cacheable&&await this.cache.save(e.id,t),this.remember(e,t,e.cacheable?P.TTL_MS:Oe)}catch(t){return this.loadFallback(e,t)}}async loadFallback(e,t){let o=e.cacheable?this.cache.getStale(e.id):void 0;if(o)return this.notifyOffline(t,"cached copy"),this.remember(e,o,Ce);if(e.id!=="bundled")try{let n=await new L(this.context).load();return this.notifyOffline(t,"registry bundled with the extension"),this.remember(e,n,Ce)}catch{}throw new Error(k(t,"Unable to load the BagUI registry."))}notifyOffline(e,t){this.offlineNoticeShown||(this.offlineNoticeShown=!0,E.window.showWarningMessage(`${k(e,"BagUI registry unavailable.")} Using the ${t} instead.`))}resolveSource(){let e=E.workspace.getConfiguration("bagui"),t=e.get("registryPath","").trim(),o=e.get("apiUrl","").trim();if(t){let n=E.workspace.workspaceFolders?.[0]?.uri.fsPath??process.cwd();return new I(ke.resolve(n,t))}if(o){if(!/^https:\/\//i.test(o))throw new Error('The "bagui.apiUrl" setting must be an https:// URL.');return new $(o)}return new $(`${C}/r/registry.json`)}};var y=c(require("vscode"));var _e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function d(r){return r.replace(/[&<>"']/g,e=>_e[e]??e)}function F(){let r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e="";for(let t=0;t<32;t+=1)e+=r.charAt(Math.floor(Math.random()*r.length));return e}function O(r){return/^https:\/\//i.test(r)||/^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(r)}function je(r){if(typeof r!="object"||r===null)return!1;let e=r;return(e.type==="install"||e.type==="preview")&&typeof e.name=="string"||e.type==="refresh"}var _=class{constructor(e,t,o,n){this.context=e;this.registry=t;this.installer=o;this.preview=n;this.registrySubscription=t.onDidChange(()=>{this.update().catch(i=>{y.window.showErrorMessage(i instanceof Error?i.message:"Unable to update the BagUI gallery.")})})}panel;components=[];homepage="https://bagui.pro";registrySubscription;dispose(){this.registrySubscription.dispose(),this.panel?.dispose()}async open(){await this.loadComponents(),this.panel||(this.panel=this.createPanel()),this.panel.title="BagUI Components",this.panel.webview.html=this.render(this.panel.webview),this.panel.reveal(y.ViewColumn.Active)}async update(){this.panel&&(await this.loadComponents(),this.panel&&(this.panel.webview.html=this.render(this.panel.webview)))}async loadComponents(){[this.components,this.homepage]=await Promise.all([this.registry.getComponents(),this.registry.getHomepage()])}createPanel(){let e=y.window.createWebviewPanel("baguiGallery","BagUI Components",y.ViewColumn.Active,{enableScripts:!0,localResourceRoots:[y.Uri.joinPath(this.context.extensionUri,"media")]});return e.onDidDispose(()=>{this.panel=void 0}),e.webview.onDidReceiveMessage(async t=>{if(je(t))try{if(t.type==="refresh"){await y.commands.executeCommand("bagui.refreshRegistry");return}let o=this.components.find(n=>n.name===t.name);if(!o)throw new Error("The selected component is no longer in the BagUI registry.");t.type==="preview"?await this.preview.show(o):(await this.installer.install(o,this.homepage),y.window.showInformationMessage(`Installing ${o.title}\u2026`))}catch(o){y.window.showErrorMessage(o instanceof Error?o.message:"Unable to perform this BagUI action.")}}),e}render(e){let t=F(),o=Array.from(new Set(this.components.map(a=>a.category))).sort((a,f)=>h(a).localeCompare(h(f))),n=this.components.map(a=>{let f=d(a.name),w=d(a.title),m=d(a.description||"BagUI component"),x=d(a.category),U=d(h(a.category)),Y=d(`${a.title} ${a.name} ${a.description} ${a.category} ${a.tags.join(" ")}`.toLowerCase()),H=a.image&&O(a.image)?`<img class="thumbnail" src="${d(a.image)}" alt="" loading="lazy" />`:`<div class="thumbnail placeholder" aria-hidden="true"><span>${U}</span></div>`;return`
          <article class="component-card" data-category="${x}" data-search="${Y}">
            <div class="thumbnail-wrap">${H}<span class="tier ${a.tier}">${a.tier}</span></div>
            <div class="card-content">
              <p class="category">${U}</p>
              <h2>${w}</h2>
              <p class="description">${m}</p>
              <div class="actions">
                <button class="secondary" data-action="preview" data-name="${f}">Preview</button>
                <button class="primary" data-action="install" data-name="${f}">Install</button>
              </div>
            </div>
          </article>`}).join(""),i=o.map(a=>`<option value="${d(a)}">${d(h(a))}</option>`).join("");return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="${["default-src 'none'",`img-src ${e.cspSource} https: data:`,`style-src 'nonce-${t}'`,`script-src 'nonce-${t}'`].join("; ")}" />
  <title>BagUI Components</title>
  <style nonce="${t}">
    :root {
      color-scheme: var(--vscode-color-scheme);
      --border: var(--vscode-widget-border, var(--vscode-panel-border, rgba(128,128,128,.35)));
      --muted: var(--vscode-descriptionForeground);
      --surface: var(--vscode-editorWidget-background, var(--vscode-editor-background));
      --accent: var(--vscode-button-background);
      --accent-text: var(--vscode-button-foreground);
    }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 26px; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family, sans-serif); }
    .shell { max-width: 1280px; margin: 0 auto; }
    header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
    h1 { margin: 0 0 5px; font-size: 24px; }
    .subtitle { margin: 0; color: var(--muted); font-size: 13px; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    input, select, button { min-height: 34px; border: 1px solid var(--border); border-radius: 6px; color: var(--vscode-input-foreground, var(--vscode-foreground)); background: var(--vscode-input-background, var(--surface)); font: inherit; }
    input, select { padding: 0 10px; }
    input { flex: 1; min-width: 200px; }
    button { padding: 0 12px; cursor: pointer; }
    button:hover { filter: brightness(1.12); }
    button:focus-visible, input:focus-visible, select:focus-visible { outline: 1px solid var(--vscode-focusBorder); outline-offset: 1px; }
    .refresh { color: var(--vscode-foreground); }
    .count { margin: 0 0 12px; color: var(--muted); font-size: 12px; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(245px, 1fr)); gap: 14px; }
    .component-card { min-width: 0; overflow: hidden; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
    .thumbnail-wrap { position: relative; height: 150px; overflow: hidden; border-bottom: 1px solid var(--border); background: var(--vscode-sideBar-background, var(--surface)); }
    .thumbnail { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; object-fit: cover; }
    .placeholder { color: var(--muted); background: linear-gradient(140deg, var(--vscode-editor-background), var(--surface)); font-size: 13px; font-weight: 600; }
    .tier { position: absolute; top: 9px; right: 9px; padding: 3px 8px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); font-size: 10px; text-transform: uppercase; }
    .tier.pro { color: var(--vscode-editorWarning-foreground, var(--muted)); }
    .card-content { padding: 13px; }
    .category { margin: 0 0 5px; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
    h2 { overflow: hidden; margin: 0; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
    .description { display: -webkit-box; min-height: 38px; overflow: hidden; margin: 7px 0 12px; color: var(--muted); font-size: 12px; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
    .actions { display: flex; gap: 8px; }
    .actions button { flex: 1; }
    .primary { border-color: var(--accent); color: var(--accent-text); background: var(--accent); }
    .secondary { color: var(--vscode-foreground); }
    .empty { display: none; padding: 36px 12px; color: var(--muted); text-align: center; }
    @media (max-width: 520px) { body { padding: 16px; } header { align-items: flex-start; flex-direction: column; } }
  </style>
</head>
<body>
  <main class="shell">
    <header>
      <div><h1>BagUI Components</h1><p class="subtitle">Browse the live registry, preview a block, and install it into your project.</p></div>
      <button class="refresh" data-action="refresh">Refresh registry</button>
    </header>
    <div class="toolbar">
      <input id="search" type="search" placeholder="Search components\u2026" aria-label="Search components" />
      <select id="category" aria-label="Filter by category"><option value="">All categories</option>${i}</select>
    </div>
    <p class="count" id="count">${this.components.length} components</p>
    <section class="gallery" id="gallery">${n}</section>
    <p class="empty" id="empty">No components match your search.</p>
  </main>
  <script nonce="${t}">
    const vscode = acquireVsCodeApi();
    const cards = [...document.querySelectorAll(".component-card")];
    const search = document.getElementById("search");
    const category = document.getElementById("category");
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    function filterCards() {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      for (const card of cards) {
        const matches = card.dataset.search.includes(query) &&
          (!category.value || card.dataset.category === category.value);
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      count.textContent = visible + (visible === 1 ? " component" : " components");
      empty.style.display = visible === 0 ? "block" : "none";
    }
    search.addEventListener("input", filterCards);
    category.addEventListener("change", filterCards);
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }
      const button = event.target.closest("button[data-action]");
      if (button instanceof HTMLButtonElement) {
        vscode.postMessage({
          type: button.dataset.action,
          name: button.dataset.name,
        });
      }
    });
  </script>
</body>
</html>`}};var l=c(require("vscode"));function Ye(r){if(typeof r!="object"||r===null)return!1;let e=r.type;return e==="install"||e==="copy-cli"||e==="docs"||e==="open-preview"}var He=`
  --bg: #f8fafc; --surface: rgba(255,255,255,0.88); --surface-strong: #ffffff; --surface-alt: #f1f5f9; --border: rgba(148,163,184,0.35);
  --text: #0f172a; --muted: #475569; --hero: linear-gradient(135deg, #ffffff 0%, #f5f3ff 38%, #ecfeff 100%);
  --shadow: 0 18px 42px rgba(15,23,42,0.08); --ring: rgba(124,58,237,0.22); --accent: #7c3aed; --accent-2: #4f46e5;`,We=`
  --bg: #020817; --surface: rgba(15,23,42,0.86); --surface-strong: #0f172a; --surface-alt: #111827; --border: rgba(148,163,184,0.22);
  --text: #e2e8f0; --muted: #94a3b8; --hero: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(76,29,149,0.9) 100%);
  --shadow: 0 20px 50px rgba(2,6,23,0.38); --ring: rgba(168,85,247,0.32); --accent: #8b5cf6; --accent-2: #4f46e5;`,Ge=`
  --bg: var(--vscode-editor-background); --surface: color-mix(in srgb, var(--vscode-editorWidget-background, var(--vscode-editor-background)) 90%, transparent); --surface-strong: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  --surface-alt: var(--vscode-input-background); --border: var(--vscode-widget-border, var(--vscode-panel-border, rgba(128,128,128,.35)));
  --text: var(--vscode-foreground); --muted: var(--vscode-descriptionForeground); --hero: linear-gradient(135deg, color-mix(in srgb, var(--vscode-editor-background) 80%, #7c3aed) 0%, color-mix(in srgb, var(--vscode-editor-background) 70%, #4f46e5) 100%);
  --shadow: 0 20px 48px rgba(15,23,42,0.18); --ring: rgba(124,58,237,0.28); --accent: color-mix(in srgb, var(--vscode-foreground) 8%, #7c3aed); --accent-2: #4f46e5;`,j=class{constructor(e,t,o){this.context=e;this.registry=t;this.installer=o}panel;current;dispose(){this.panel?.dispose()}async show(e){this.current=e;let t=await this.registry.getHomepage(),o=await this.installer.getCommand(e,t);this.panel||(this.panel=this.createPanel()),this.panel.title=e.title,this.panel.webview.html=this.render(this.panel.webview,e,o,t),this.panel.reveal(l.ViewColumn.Beside,!0)}createPanel(){let e=l.window.createWebviewPanel("baguiPreview","BagUI",{viewColumn:l.ViewColumn.Beside,preserveFocus:!0},{enableScripts:!0,localResourceRoots:[l.Uri.joinPath(this.context.extensionUri,"media")]});return e.onDidDispose(()=>{this.panel=void 0,this.current=void 0}),e.webview.onDidReceiveMessage(async t=>{let o=this.current;if(!(!o||!Ye(t)))try{switch(t.type){case"install":await l.commands.executeCommand("bagui.installComponent",o.name);break;case"copy-cli":await l.env.clipboard.writeText(await this.installer.getCommand(o,await this.registry.getHomepage())),l.window.showInformationMessage(`CLI command copied for ${o.title}`);break;case"docs":await l.commands.executeCommand("bagui.openDocumentation",o.name);break;case"open-preview":{let n=await this.registry.getHomepage(),i=this.getLivePreviewUrl(o,n);if(!i)throw new Error("A live preview URL is not available for this registry.");if(!await l.env.openExternal(l.Uri.parse(i)))throw new Error(`Unable to open ${i}`);break}}}catch(n){l.window.showErrorMessage(n instanceof Error?n.message:"Unable to perform this BagUI action.")}}),e}render(e,t,o,n){let i=F(),s=l.workspace.getConfiguration("bagui").get("theme","system"),a=s==="dark"?We:s==="light"?He:Ge,f=s==="dark"?"dark":s==="light"?"light":"light dark",w=t.tier==="pro",m=d(t.title),x=this.getLivePreviewUrl(t,n),U=x?new URL(x).origin:"",Y=["default-src 'none'",`img-src ${e.cspSource} https: data:`,`frame-src ${U||"'none'"}`,`style-src 'nonce-${i}'`,`script-src 'nonce-${i}'`].join("; "),H=x?`<iframe class="live-preview" src="${d(x)}" title="Live preview of ${m}" loading="lazy" sandbox="allow-scripts allow-same-origin"></iframe>`:t.image&&O(t.image)?`<img src="${d(t.image)}" alt="${m}" />`:`<div class="placeholder" role="img" aria-label="${m}"><span>${m}</span></div>`,Pe=t.tags.map(Ee=>`<span class="pill">${d(Ee)}</span>`).join("");return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="${Y}" />
  <title>${m}</title>
  <style nonce="${i}">
    :root { color-scheme: ${f}; ${a}; }
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
    .live-preview {
      display: block; width: 100%; height: 360px; border: 1px solid var(--border); border-radius: 16px; background: var(--surface-strong);
    }
    .preview-link { margin-top: 12px; }
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
      <span class="badge">${w?"Pro":"Free"}</span>
      <h1>${m}</h1>
      <p>${d(t.description)}</p>
      <div class="actions">
        <button class="primary" data-action="install">Install</button>
        <button data-action="copy-cli">Copy CLI</button>
        <button data-action="docs">Open Documentation</button>
      </div>
    </section>
    <section class="grid">
      <div class="card">
        <h2>Live preview</h2>
        ${H}
        ${x?'<button class="preview-link" data-action="open-preview">Open full preview in browser</button>':""}
      </div>
      <div class="card">
        <h2>Details</h2>
        <dl>
          <dt>Category</dt><dd>${d(h(t.category))}</dd>
          <dt>Version</dt><dd>${d(t.version??"1.0.0")}</dd>
          <dt>Plan</dt><dd>${w?"Pro":"Free"}</dd>
        </dl>
        <div class="pills">${Pe}</div>
      </div>
    </section>
    <section class="card"><h2>Install command</h2><code>${d(o)}</code></section>
  </main>
  <script nonce="${i}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => vscode.postMessage({ type: button.getAttribute("data-action") }));
    });
  </script>
</body>
</html>`}getLivePreviewUrl(e,t){try{let o=new URL(t);return o.protocol!=="https:"||!/^[a-z0-9][a-z0-9._-]*$/i.test(e.name)?void 0:(o.hostname==="bagui.pro"&&(o.hostname="www.bagui.pro"),new URL(`/fullscreen/${encodeURIComponent(e.name)}`,o).toString())}catch{return}}};function Ve(r){let e=new P(r),t=new B(r,e),o=new M(r),n=new z,i=new j(r,t,n),s=new _(r,t,n,i),a=new A(t,o),f=T.window.createTreeView("bagui.components",{treeDataProvider:a,showCollapseAll:!0});r.subscriptions.push(t,o,s,i,a,f,...fe({registry:t,installer:n,favorites:o,preview:i,gallery:s}),T.workspace.onDidChangeConfiguration(w=>{(w.affectsConfiguration("bagui.registryPath")||w.affectsConfiguration("bagui.apiUrl"))&&t.refresh().catch(m=>{T.window.showErrorMessage(m instanceof Error?m.message:"Unable to load the BagUI registry.")})}))}function qe(){}0&&(module.exports={activate,deactivate});
