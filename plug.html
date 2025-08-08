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
          const lbl = document.createElement('label'); lbl.className='mini-btn mini-file'; lbl.title='Insert image'; lbl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 15l-5-5-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
          lbl.appendChild(inp); this.toolbar.appendChild(lbl); this._imageInput = inp; break;
        }
        case 'undo': this.toolbar.appendChild(makeBtn('undo','↶','Undo')); break;
        case 'redo': this.toolbar.appendChild(makeBtn('redo','↷','Redo')); break;
        case 'clear': this.toolbar.appendChild(makeBtn('clear','✖','Clear content')); break;
        case 'export': this.toolbar.appendChild(makeBtn('export','⤓','Export HTML')); break;
        default: this.toolbar.appendChild(makeBtn(item,item,item));
      }
    });

    // map buttons
    this.toolbar.querySelectorAll('button, label').forEach(n => {
      const cmd = n.dataset.cmd || n.title || n.innerText;
      if(cmd) this.buttons[cmd] = n;
    });
  }

  _bindEvents(){
    this._onToolbar = this._onToolbar.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._onImageChange = this._onImageChange.bind(this);

    this.toolbar.addEventListener('click', this._onToolbar);
    this.content.addEventListener('input', this._onInput);
    this.content.addEventListener('paste', this._onPaste);
    this.content.addEventListener('keydown', this._onKeydown);
    document.addEventListener('selectionchange', this._onSelectionChange);

    if(this._imageInput) this._imageInput.addEventListener('change', this._onImageChange);
  }

  _onToolbar(e){
    const btn = e.target.closest('button,label');
    if(!btn) return;
    if(btn.tagName.toLowerCase() === 'label' && btn.querySelector('input')) return; // image label click
    const cmd = btn.dataset.cmd;
    if(!cmd) return;
    switch(cmd){
      case 'bold': this.exec('bold'); break;
      case 'italic': this.exec('italic'); break;
      case 'underline': this.exec('underline'); break;
      case 'h1': this.exec('formatBlock','h1'); break;
      case 'h2': this.exec('formatBlock','h2'); break;
      case 'p': this.exec('formatBlock','p'); break;
      case 'ul': this.exec('insertUnorderedList'); break;
      case 'ol': this.exec('insertOrderedList'); break;
      case 'blockquote': this.exec('formatBlock','blockquote'); break;
      case 'link': this._linkDialog(); break;
      case 'undo': this.exec('undo'); break;
      case 'redo': this.exec('redo'); break;
      case 'clear': if(confirm('Clear content?')) this.clear(); break;
      case 'export': this._export(); break;
      default: this.emit('command', { cmd, editor:this });
    }
    this.content.focus();
  }

  _onImageChange(e){
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if(!f) return;
    const max = (this.options.maxImageSizeMB || 6) * 1024 * 1024;
    if(f.size > max) return alert('Image too large (max ' + (max/1024/1024) + 'MB).');

    if(typeof this.options.imageUploader === 'function'){
      const p = this.options.imageUploader(f);
      if(!(p instanceof Promise)) return console.error('imageUploader must return Promise');
      p.then(url => this._insertImage(url, f.name)).catch(err => { console.error(err); alert('Upload failed'); });
      return;
    }

    const r = new FileReader();
    r.onload = (ev) => this._insertImage(ev.target.result, f.name);
    r.readAsDataURL(f);
  }

  _insertImage(url, alt=''){
    const img = document.createElement('img'); img.src = url; img.alt = alt;
    const sel = window.getSelection(); const range = sel.rangeCount ? sel.getRangeAt(0) : null;
    if(range){
      range.collapse(false);
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      sel.removeAllRanges(); sel.addRange(range);
    } else this.content.appendChild(img);
    this._onInput();
    this.emit('imageInsert', { url, alt });
  }

  _linkDialog(){
    const sel = window.getSelection();
    if(sel.isCollapsed){
      const text = prompt('Link text (optional):','');
      const urlRaw = prompt('URL (https://...):','https://');
      const url = this._sanitizeUrl(urlRaw); if(!url) return alert('Invalid URL');
      const a = document.createElement('a'); a.href = url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent = text || url;
      const range = sel.rangeCount ? sel.getRangeAt(0) : null;
      if(range) range.insertNode(a); else this.content.appendChild(a);
      this._onInput();
    } else {
      const urlRaw = prompt('URL for selected text (https://):','https://'); const url = this._sanitizeUrl(urlRaw); if(!url) return alert('Invalid URL');
      this.exec('createLink', url);
      setTimeout(()=>{ const a = window.getSelection().anchorNode && window.getSelection().anchorNode.closest && window.getSelection().anchorNode.closest('a'); if(a){ a.target='_blank'; a.rel='noopener noreferrer'; } }, 10);
    }
  }

  _sanitizeUrl(raw){
    try { const u = new URL(raw, location.href); if(['http:','https:','mailto:'].includes(u.protocol)) return u.href; return null; } catch(e){ return null; }
  }

  _onInput(){
    this._updateCount();
    this._syncToSource();
    this.emit('input', { html:this.getHTML(), text:this.getText() });
  }

  _onPaste(e){
    e.preventDefault();
    const clipboard = (e.clipboardData || window.clipboardData);
    const html = clipboard.getData('text/html');
    const text = clipboard.getData('text/plain');
    let content = html || text;
    if(!content) return;
    const sanitized = this.options.sanitize(content);
    const range = window.getSelection().rangeCount ? window.getSelection().getRangeAt(0) : null;
    if(range){
      range.deleteContents();
      const frag = document.createRange().createContextualFragment(sanitized);
      range.insertNode(frag);
    } else this.content.innerHTML += sanitized;
    this._onInput();
  }

  _onKeydown(e){
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); this._linkDialog(); return; }
    setTimeout(()=>this._updateToolbarState(), 0);
  }

  _onSelectionChange(){
    if(document.activeElement === this.content || this.content.contains(document.activeElement)) this._updateToolbarState();
  }

  exec(cmd, value=null){
    switch(cmd){
      case 'h1': cmd='formatBlock'; value='h1'; break;
      case 'h2': cmd='formatBlock'; value='h2'; break;
      case 'p': cmd='formatBlock'; value='p'; break;
      case 'ul': cmd='insertUnorderedList'; break;
      case 'ol': cmd='insertOrderedList'; break;
      case 'blockquote': cmd='formatBlock'; value='blockquote'; break;
    }
    try { document.execCommand(cmd, false, value); this._updateToolbarState(); this.emit('exec', { cmd, value }); }
    catch(err){ console.warn('execCommand failed', err); }
  }

  getHTML(){ return this.options.sanitize(this.content.innerHTML); }
  setHTML(html){ this.content.innerHTML = html || ''; this._updateCount(); this._syncToSource(); }
  getText(){ return this.content.innerText || ''; }
  clear(){ this.content.innerHTML = '<p></p>'; this._onInput(); this.emit('clear'); }
  focus(){ this.content.focus(); }

  destroy(){
    this.toolbar.removeEventListener('click', this._onToolbar);
    this.content.removeEventListener('input', this._onInput);
    this.content.removeEventListener('paste', this._onPaste);
    this.content.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('selectionchange', this._onSelectionChange);
    if(this._imageInput) this._imageInput.removeEventListener('change', this._onImageChange);
    if(this.sourceInput) this.sourceInput.style.display='';
    if(this.container && this.container.parentNode) this.container.parentNode.replaceChild(this.sourceInput || document.createTextNode(this.getHTML()), this.container);
    this.emit('destroy');
  }

  on(ev, fn){ (this.events[ev]=this.events[ev]||[]).push(fn); }
  off(ev, fn){ this.events[ev]=(this.events[ev]||[]).filter(x=>x!==fn); }
  emit(ev, payload={}){ (this.events[ev]||[]).forEach(fn=>{ try{ fn(payload); } catch(e){ console.error(e); } }); }

  registerPlugin(p){ this.plugins.push(p); if(typeof p.init==='function') p.init(this); }

  _updateCount(){ const t=(this.content.innerText||'').trim(); this.count.textContent = (t.length? t.length+' characters' : '0 characters'); }
  _syncToSource(){ if(this.sourceInput) this.sourceInput.value = this.getHTML(); }

  _updateToolbarState(){
    ['bold','italic','underline','insertUnorderedList','insertOrderedList'].forEach(cmd=>{
      const st = document.queryCommandState(cmd);
      const b = this.buttons[cmd] || this.buttons[cmd.replace(/insert/,'')];
      if(b) b.setAttribute('aria-pressed', st ? 'true' : 'false');
    });
  }

  _export(){
    console.log('MiniEditor Export:', this.getHTML());
    this._toast('Exported HTML to console');
  }

  _toast(msg){
    const t = document.getElementById('toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2000);
  }

  _callHook(name, ...args){ this.plugins.forEach(p=>{ if(typeof p[name]==='function') try{ p[name](this, ...args); } catch(e){ console.error(e); } }); }
}

/* ===== Factory export (for this demo we attach to window) ===== */
window.createMiniEditor = (sel, opts) => new MiniEditor(sel, opts);

/* ===== Demo usage below ===== */

const editor = window.createMiniEditor('#sourceContent', {
  placeholder: 'Write something epic...',
  initialHtml: '',
  // Example image uploader (commented) — return Promise<string url>
  // imageUploader: async (file) => {
  //   const fd = new FormData(); fd.append('file', file);
  //   const r = await fetch('/upload', { method:'POST', body: fd });
  //   const data = await r.json(); return data.url;
  // }
  sanitize: html => MiniEditor.defaultSanitize(html),
});

// wire demo buttons
document.getElementById('btnGetHtml').addEventListener('click', ()=>{
  const html = editor.getHTML();
  document.getElementById('htmlOut').textContent = html;
  console.log(html);
  document.getElementById('toast').classList.add('show'); setTimeout(()=>document.getElementById('toast').classList.remove('show'),1400);
});
document.getElementById('btnGetText').addEventListener('click', ()=> document.getElementById('htmlOut').textContent = editor.getText());
document.getElementById('btnClear').addEventListener('click', ()=> { if(confirm('Clear content?')) editor.clear(); });

// small sample plugin: word counter in status
editor.registerPlugin({
  init(ed){
    const el = document.createElement('div'); el.style.opacity='0.9'; el.style.fontSize='13px'; el.style.color='var(--muted)'; el.style.marginLeft='8px';
    ed.status.appendChild(el);
    const update = ()=> el.textContent = 'Words: ' + (ed.getText().trim().split(/\s+/).filter(Boolean).length);
    ed.on('input', update); update();
  }
});

// auto-focus editor for nicer demo
setTimeout(()=>editor.focus(), 300);

</script>
</body>
</html>
