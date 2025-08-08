<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>MiniEditor — Polished Plugin Demo</title>
<style>
  /* ===== MiniEditor CSS (polished UI) ===== */
  :root{
    --bg:#f4f7fb;
    --card:#ffffff;
    --muted:#7a8796;
    --accent:#0066ff;
    --accent-600:#0052cc;
    --border:#e6eef9;
    --glass: rgba(255,255,255,0.6);
    --radius:12px;
  }
  html,body{height:100%}
  body{
    margin:28px;
    font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background:linear-gradient(180deg,#eef5ff 0%, var(--bg) 100%);
    color:#102030;
    -webkit-font-smoothing:antialiased;
  }

  .demo-wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 360px;gap:20px;}
  @media (max-width:1024px){ .demo-wrap{grid-template-columns:1fr} }

  /* Editor container */
  .mini-editor-wrap{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:var(--radius);
    box-shadow:0 10px 30px rgba(12,20,40,0.06);
    overflow:hidden;
    display:flex;
    flex-direction:column;
    min-height:420px;
    transition:transform .18s ease, box-shadow .18s ease;
  }
  .mini-editor-wrap:focus-within{box-shadow:0 18px 48px rgba(6,24,80,0.12); transform:translateY(-2px);}

  /* Toolbar */
  .mini-editor-toolbar{
    display:flex;
    align-items:center;
    gap:8px;
    padding:12px;
    background:linear-gradient(180deg, rgba(245,249,255,0.6), rgba(250,251,255,0.9));
    border-bottom:1px solid var(--border);
    flex-wrap:wrap;
  }
  .mini-btn{
    background:transparent;
    border:0;
    padding:8px 10px;
    border-radius:10px;
    cursor:pointer;
    display:inline-flex;
    align-items:center;
    gap:8px;
    color:var(--muted);
    font-size:14px;
    transition:all .12s ease;
  }
  .mini-btn:hover{background:var(--glass); color:#0b2b5a; transform:translateY(-1px)}
  .mini-btn[aria-pressed="true"]{background:var(--accent); color:white; box-shadow:0 6px 18px rgba(6,24,80,0.12)}
  .mini-btn svg{width:18px;height:18px;opacity:0.9}

  .mini-sep{width:1px;height:28px;background:var(--border);margin:0 6px;border-radius:3px}

  /* file label */
  .mini-file{
    position:relative; overflow:hidden; display:inline-block;
  }
  .mini-file input{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;cursor:pointer}

  /* editor content */
  .mini-editor-content{
    padding:22px;
    min-height:300px;
    outline:none;
    background:linear-gradient(180deg,#ffffff,#fbfdff);
    font-size:16px;
    line-height:1.65;
    color:#0f1724;
  }
  .mini-editor-content:empty:before{
    content:attr(data-placeholder);
    color:var(--muted);
    pointer-events:none;
    display:block;
    opacity:0.9;
  }
  .mini-editor-content img{max-width:100%;border-radius:8px;margin:6px 0;box-shadow:0 6px 20px rgba(6,24,80,0.04)}

  /* status bar */
  .mini-editor-status{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-top:1px solid var(--border);font-size:13px;color:var(--muted)}
  .mini-actions{display:flex;gap:8px;align-items:center}

  /* right column demo UI */
  .panel{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;box-shadow:0 6px 18px rgba(12,20,40,0.03)}
  .panel h4{margin:0 0 10px 0;font-size:15px;color:#0f2133}
  .panel .output{white-space:pre-wrap;background:#0b1220;color:#f8fafc;padding:10px;border-radius:8px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;font-size:13px}

  /* small helpers */
  .pill{background:#eef6ff;border-radius:999px;padding:6px 10px;color:#0b2b5a;font-weight:600;font-size:13px}
  .kbd{background:#0b1220;color:#fff;padding:3px 6px;border-radius:6px;font-size:12px}

  /* animations for toolbar flyout */
  .toast{position:fixed;right:20px;bottom:20px;background:#111827;color:#fff;padding:10px 12px;border-radius:8px;box-shadow:0 8px 36px rgba(2,6,23,0.4);opacity:0;transform:translateY(8px);transition:all .25s ease}
  .toast.show{opacity:1;transform:none}
</style>
</head>
<body>

<div class="demo-wrap">
  <!-- Left: editor -->
  <div>
    <div id="postContent" class="mini-editor-wrap-placeholder">
      <!-- Target element will be replaced by plugin init -->
      <textarea id="sourceContent" name="content" style="display:none">
        <h2>MiniEditor Demo</h2>
        <p>Pretty, usable, plugin-ready editor — fully standalone.</p>
      </textarea>
    </div>
  </div>

  <!-- Right: controls & output -->
  <div>
    <div class="panel">
      <h4>Quick Actions</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button id="btnGetHtml" class="mini-btn" style="padding:8px 12px;border:1px solid var(--border);">Get HTML</button>
        <button id="btnGetText" class="mini-btn" style="padding:8px 12px;border:1px solid var(--border);">Get Text</button>
        <button id="btnClear" class="mini-btn" style="padding:8px 12px;border:1px solid var(--border);">Clear</button>
      </div>
      <hr style="margin:12px 0;border:none;border-top:1px dashed var(--border)">
      <h4>Export / Preview</h4>
      <div id="htmlOut" class="output" style="min-height:120px"></div>
    </div>

    <div style="height:14px"></div>

    <div class="panel" style="margin-top:12px">
      <h4>Plugin Tips</h4>
      <p style="margin:6px 0;color:var(--muted)">This editor exposes a plugin API and events. You can register custom uploaders, add toolbar commands, or wire autosave.</p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <span class="pill">Extensible</span>
        <span class="pill">Sanitize</span>
        <span class="pill">Upload-ready</span>
      </div>
    </div>
  </div>
</div>

<div id="toast" class="toast">Exported to console</div>

<script type="module">
/* ===== MiniEditor ES module (embedded) - polished version ===== */

const DEFAULT_TOOLBAR = [
  'bold','italic','underline','sep',
  'h1','h2','p','sep',
  'ul','ol','blockquote','sep',
  'link','image','sep',
  'undo','redo','clear','export'
];

class MiniEditor {
  constructor(selectorOrNode, options = {}) {
    this.options = Object.assign({
      toolbar: DEFAULT_TOOLBAR,
      placeholder: 'Start writing your masterpiece...',
      imageUploader: null,
      sanitize: html => MiniEditor.defaultSanitize(html),
      classes: {},
      initialHtml: '',
      maxImageSizeMB: 6
    }, options);

    this.events = {};
    this.plugins = [];
    this._initElement(selectorOrNode);
    if(this.options.initialHtml) this.setHTML(this.options.initialHtml);
    this._callHook('init');
  }

  static defaultSanitize(html){
    // minimal: remove script/style and on* attrs and javascript: href/src
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style').forEach(n => n.remove());
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null, false);
    while(walker.nextNode()){
      const el = walker.currentNode;
      for(const attr of Array.from(el.attributes || [])){
        const name = attr.name.toLowerCase();
        const val = attr.value || '';
        if(name.startsWith('on')) el.removeAttribute(attr.name);
        if((name === 'href' || name === 'src') && val.trim().toLowerCase().startsWith('javascript:')) el.removeAttribute(attr.name);
      }
    }
    return doc.body.innerHTML;
  }

  _initElement(selectorOrNode){
    this.original = (typeof selectorOrNode === 'string') ? document.querySelector(selectorOrNode) : selectorOrNode;
    if(!this.original) throw new Error('MiniEditor: target not found');

    // container
    this.container = document.createElement('div');
    this.container.className = 'mini-editor-wrap';
    // toolbar
    this.toolbar = document.createElement('div'); this.toolbar.className = 'mini-editor-toolbar';
    // content
    this.content = document.createElement('div'); this.content.className = 'mini-editor-content';
    this.content.contentEditable = 'true';
    this.content.setAttribute('data-placeholder', this.options.placeholder);
    this.content.setAttribute('role','textbox');
    // status
    this.status = document.createElement('div'); this.status.className = 'mini-editor-status';
    this.count = document.createElement('div'); this.count.className = 'mini-editor-count'; this.count.textContent = '0 characters';
    this.status.appendChild(this.count);
    const controls = document.createElement('div'); controls.className = 'mini-actions';
    this.status.appendChild(controls);

    // build structure
    this.container.appendChild(this.toolbar);
    this.container.appendChild(this.content);
    this.container.appendChild(this.status);

    // replace original (if textarea/input keep a reference)
    const parent = this.original.parentNode;
    parent.replaceChild(this.container, this.original);
    if(this.original.tagName && ['TEXTAREA','INPUT'].includes(this.original.tagName.toUpperCase())){
      this.sourceInput = this.original;
      this.sourceInput.style.display = 'none';
      this.container.appendChild(this.sourceInput);
      if(this.sourceInput.value) this.content.innerHTML = this.sourceInput.value;
    } else {
      this.sourceInput = null;
      if(this.original.innerHTML && this.original.innerHTML.trim()) this.content.innerHTML = this.original.innerHTML;
    }

    this._renderToolbar();
    this._bindEvents();
    this._updateCount();
  }

  _renderToolbar(){
    this.toolbar.innerHTML = '';
    this.buttons = {};
    const makeBtn = (id, html, title) => {
      const b = document.createElement('button');
      b.className = 'mini-btn';
      b.type = 'button';
      b.dataset.cmd = id;
      if(title) b.title = title;
      b.innerHTML = html;
      return b;
    };

    this.options.toolbar.forEach(item => {
      if(item === 'sep'){ const s = document.createElement('span'); s.className='mini-sep'; this.toolbar.appendChild(s); return; }
      switch(item){
        case 'bold': this.toolbar.appendChild(makeBtn('bold','<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5h4a3 3 0 110 6H8zM8 11h5a3 3 0 010 6H8z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>','Bold')); break;
        case 'italic': this.toolbar.appendChild(makeBtn('italic','<svg viewBox="0 0 24 24"><path d="M10 4h8M6 20h8M14 4l-8 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>','Italic')); break;
        case 'underline': this.toolbar.appendChild(makeBtn('underline','<svg viewBox="0 0 24 24"><path d="M7 4v6a5 5 0 0010 0V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 20h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>','Underline')); break;
        case 'h1': this.toolbar.appendChild(makeBtn('h1','H1','Heading 1')); break;
        case 'h2': this.toolbar.appendChild(makeBtn('h2','H2','Heading 2')); break;
        case 'p': this.toolbar.appendChild(makeBtn('p','P','Paragraph')); break;
        case 'ul': this.toolbar.appendChild(makeBtn('ul','<svg viewBox="0 0 24 24"><path d="M7 6h14M7 12h14M7 18h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>','Bulleted list')); break;
        case 'ol': this.toolbar.appendChild(makeBtn('ol','1.','Numbered list')); break;
        case 'blockquote': this.toolbar.appendChild(makeBtn('blockquote','❝','Blockquote')); break;
        case 'link': this.toolbar.appendChild(makeBtn('link','<svg viewBox="0 0 24 24"><path d="M10 14a3 3 0 004.24 0l2.12-2.12a3 3 0 10-4.24-4.24L10 9.76" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 10a3 3 0 00-4.24 0L7.64 12.12a3 3 0 104.24 4.24L14 14.24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>','Insert link')); break;
        case 'image': {
          const lbl = document.createElement('label'); lbl.className='mini-btn mini-file'; lbl.title='Insert image'; lbl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-
