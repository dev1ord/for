/* mini-editor.js
   Tiny, extensible WYSIWYG editor plugin (ES module)
   - Lightweight: no external deps
   - Plugin-friendly API
   - Default image insertion via DataURL, but supports custom upload handlers
*/

const DEFAULT_TOOLBAR = [
  'bold','italic','underline','separator',
  'h1','h2','p','separator',
  'ul','ol','blockquote','separator',
  'link','image','separator',
  'undo','redo','clear','export'
];

class MiniEditor {
  constructor(selectorOrNode, options = {}) {
    // options: toolbar, placeholder, imageUploader (async fn file => url),
    // sanitize (fn html => html), classes, initialHtml, on (events)
    this.options = Object.assign({
      toolbar: DEFAULT_TOOLBAR,
      placeholder: 'Start writing...',
      imageUploader: null, // if provided should be async(file): returns url
      sanitize: html => MiniEditor.defaultSanitize(html),
      classes: {},
      initialHtml: '',
      maxImageSizeMB: 5,
    }, options);

    this.plugins = [];
    this.events = {}; // eventName -> [listeners]

    this._buildFor(selectorOrNode);
    if(this.options.initialHtml) this.setHTML(this.options.initialHtml);
    this._callHook('init');
  }

  // -----------------------
  // static helpers
  // -----------------------
  static defaultSanitize(html){
    // Minimal sanitizer: strips <script> and on* attributes.
    // **Important:** This is intentionally basic. Always sanitize server-side.
    const div = document.createElement('div');
    div.innerHTML = html;
    // remove <script> and <style>
    div.querySelectorAll('script,style').forEach(n => n.remove());
    // remove event handler attributes and javascript: hrefs
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT, null, false);
    while(walker.nextNode()){
      const el = walker.currentNode;
      for(const attr of Array.from(el.attributes || [])){
        const name = attr.name.toLowerCase();
        const val = attr.value || '';
        if(name.startsWith('on')) el.removeAttribute(attr.name);
        if(name === 'href' && val.trim().toLowerCase().startsWith('javascript:')) el.removeAttribute('href');
        if(name === 'src' && val.trim().toLowerCase().startsWith('javascript:')) el.removeAttribute('src');
        // optionally strip style attr (uncomment if desired): el.removeAttribute('style');
      }
    }
    return div.innerHTML;
  }

  // -----------------------
  // initialize DOM
  // -----------------------
  _buildFor(selectorOrNode){
    this.target = (typeof selectorOrNode === 'string') ? document.querySelector(selectorOrNode) : selectorOrNode;
    if(!this.target) throw new Error('MiniEditor: target not found');

    // wrap if target is not contenteditable
    if(this.target.getAttribute('data-mini-editor') === 'true'){
      // already initialized (support idempotent)
      this.container = this.target.closest('.mini-editor-wrap');
      return;
    }

    // create container
    this.container = document.createElement('div');
    this.container.className = 'mini-editor-wrap';
    if(this.options.classes.wrap) this.container.classList.add(this.options.classes.wrap);

    // toolbar
    this.toolbarEl = document.createElement('div');
    this.toolbarEl.className = 'mini-editor-toolbar';
    this.container.appendChild(this.toolbarEl);

    // content area
    this.editorEl = document.createElement('div');
    this.editorEl.className = 'mini-editor-content';
    this.editorEl.contentEditable = 'true';
    this.editorEl.spellcheck = true;
    this.editorEl.setAttribute('role','textbox');
    this.editorEl.setAttribute('data-placeholder', this.options.placeholder);
    this.container.appendChild(this.editorEl);

    // status bar (char count & controls)
    this.statusEl = document.createElement('div');
    this.statusEl.className = 'mini-editor-status';
    this.charCountEl = document.createElement('div');
    this.charCountEl.className = 'mini-editor-count';
    this.statusEl.appendChild(this.charCountEl);
    this.container.appendChild(this.statusEl);

    // replace target with container, and insert target as hidden input if it's a textarea/input
    const parent = this.target.parentNode;
    parent.replaceChild(this.container, this.target);

    // if original is textarea or input, store it for syncing on save
    if(this.target.tagName && (this.target.tagName.toLowerCase() === 'textarea' || this.target.tagName.toLowerCase() === 'input')){
      this.originalInput = this.target;
      this.originalInput.style.display = 'none';
      this.container.appendChild(this.originalInput);
    } else {
      this.originalInput = null;
    }

    // place initial content if passed in HTML of node, else keep initialHtml option
    if(!this.options.initialHtml){
      const existingHtml = (this.target.innerHTML && this.target.innerHTML.trim()) ? this.target.innerHTML : '';
      if(existingHtml) this.editorEl.innerHTML = existingHtml;
    }

    // data attribute to mark initialization
    this.editorEl.setAttribute('data-mini-editor','true');

    // build toolbar UI
    this._renderToolbar();

    // wire handlers
    this._bindHandlers();

    // expose simple API on container
    this.container.__miniEditor = this;
  }

  // -----------------------
  // toolbar UI
  // -----------------------
  _renderToolbar(){
    this.toolbarEl.innerHTML = '';
    this.buttons = {};

    const createButton = (id, label, title) => {
      const btn = document.createElement('button');
      btn.className = 'mini-btn';
      btn.type = 'button';
      btn.dataset.cmd = id;
      btn.title = title || id;
      btn.innerHTML = label;
      return btn;
    };

    this.options.toolbar.forEach(item => {
      if(item === 'separator'){
        const sep = document.createElement('span');
        sep.className = 'mini-sep';
        this.toolbarEl.appendChild(sep);
        return;
      }
      switch(item){
        case 'bold': this.toolbarEl.appendChild(createButton('bold','<b>B</b>','Bold (Ctrl/Cmd+B)')); break;
        case 'italic': this.toolbarEl.appendChild(createButton('italic','<i>I</i>','Italic (Ctrl/Cmd+I)')); break;
        case 'underline': this.toolbarEl.appendChild(createButton('underline','<u>U</u>','Underline (Ctrl/Cmd+U)')); break;
        case 'h1': this.toolbarEl.appendChild(createButton('h1','H1','Heading 1')); break;
        case 'h2': this.toolbarEl.appendChild(createButton('h2','H2','Heading 2')); break;
        case 'p': this.toolbarEl.appendChild(createButton('p','P','Paragraph')); break;
        case 'ul': this.toolbarEl.appendChild(createButton('ul','• List','Bulleted list')); break;
        case 'ol': this.toolbarEl.appendChild(createButton('ol','1. List','Numbered list')); break;
        case 'blockquote': this.toolbarEl.appendChild(createButton('blockquote','❝','Blockquote')); break;
        case 'link': {
          const b = createButton('link','🔗','Insert link');
          this.toolbarEl.appendChild(b);
          break;
        }
        case 'image': {
          const wrap = document.createElement('label');
          wrap.className='mini-btn mini-file';
          wrap.title='Insert image';
          wrap.innerHTML = '🖼️';
          const inp = document.createElement('input');
          inp.type = 'file';
          inp.accept = 'image/*';
          inp.style.display='none';
          wrap.appendChild(inp);
          this.toolbarEl.appendChild(wrap);
          this._imageInput = inp;
          break;
        }
        case 'undo': this.toolbarEl.appendChild(createButton('undo','↶','Undo')); break;
        case 'redo': this.toolbarEl.appendChild(createButton('redo','↷','Redo')); break;
        case 'clear': this.toolbarEl.appendChild(createButton('clear','Clear','Clear content')); break;
        case 'export': this.toolbarEl.appendChild(createButton('export','Export','Export HTML to console')); break;
        default:
          // allow custom commands to be added later by plugin
          const b = createButton(item,item,item);
          this.toolbarEl.appendChild(b);
      }
    });

    // map buttons
    this.toolbarEl.querySelectorAll('button, label').forEach(n => {
      const cmd = n.dataset.cmd || n.title || n.innerText;
      if(cmd) this.buttons[cmd] = n;
    });

  }

  // -----------------------
  // core handlers
  // -----------------------
  _bindHandlers(){
    this._onToolbarClick = this._onToolbarClick.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this._onImageSelected = this._onImageSelected.bind(this);

    this.toolbarEl.addEventListener('click', this._onToolbarClick);
    this.editorEl.addEventListener('input', this._onInput);
    this.editorEl.addEventListener('paste', this._onPaste);
    this.editorEl.addEventListener('keydown', this._onKeydown);
    document.addEventListener('selectionchange', this._onSelectionChange);

    if(this._imageInput) this._imageInput.addEventListener('change', this._onImageSelected);

    // initial char count
    this._updateCharCount();
  }

  _onToolbarClick(e){
    const btn = e.target.closest('button, label, .mini-btn');
    if(!btn) return;
    // handle file label click separately
    if(btn.tagName.toLowerCase() === 'label' && btn.querySelector('input[type=file]')) return;
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
      case 'link': this._openLinkDialog(); break;
      case 'undo': this.exec('undo'); break;
      case 'redo': this.exec('redo'); break;
      case 'clear': if(confirm('Clear editor content?')) this.clear(); break;
      case 'export': console.log('MiniEditor Export:', this.getHTML()); alert('HTML exported to console'); break;
      default:
        // custom commands -> emit event for plugin/consumer
        this.emit('command', { cmd, editor: this });
    }
    this.editorEl.focus();
  }

  _onImageSelected(e){
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // reset
    if(!file) return;
    const max = (this.options.maxImageSizeMB || 5) * 1024 * 1024;
    if(file.size > max) return alert('Image too large. Max ' + (max/1024/1024) + 'MB');

    // if custom uploader provided, use it
    if(typeof this.options.imageUploader === 'function'){
      const uploadPromise = this.options.imageUploader(file);
      if(!(uploadPromise instanceof Promise)) return console.error('imageUploader must return a Promise');
      uploadPromise.then(url => {
        if(!url) throw new Error('Uploader returned falsy URL');
        this._insertImage(url, file.name);
      }).catch(err => {
        console.error('Image upload failed', err);
        alert('Image upload failed');
      });
      return;
    }

    // default: data URL
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      this._insertImage(url, file.name);
    };
    reader.readAsDataURL(file);
  }

  _insertImage(url, alt = ''){
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.style.maxWidth = '100%';
    const range = window.getSelection().rangeCount ? window.getSelection().getRangeAt(0) : null;
    if(range){
      range.collapse(false);
      range.insertNode(img);
    } else {
      this.editorEl.appendChild(img);
    }
    this.emit('imageInsert', { url, alt });
  }

  _openLinkDialog(){
    const sel = window.getSelection();
    if(sel.isCollapsed){
      const text = prompt('Text for link (optional):','');
      const raw = prompt('Enter URL (https://...)','https://');
      const url = this._sanitizeUrl(raw);
      if(!url) return alert('Invalid URL');
      const a = document.createElement('a');
      a.href = url; a.target='_blank'; a.rel='noopener noreferrer';
      a.textContent = text || url;
      const range = sel.rangeCount ? sel.getRangeAt(0) : null;
      if(range) range.insertNode(a);
      else this.editorEl.appendChild(a);
      this.emit('linkInsert', { url, text: a.textContent });
    } else {
      const raw = prompt('Enter URL (https://...)','https://');
      const url = this._sanitizeUrl(raw);
      if(!url) return alert('Invalid URL');
      this.exec('createLink', url);
      // ensure attributes set
      setTimeout(()=>{
        const anchor = window.getSelection().anchorNode && window.getSelection().anchorNode.closest && window.getSelection().anchorNode.closest('a');
        if(anchor){ anchor.target = '_blank'; anchor.rel='noopener noreferrer'; }
      }, 10);
      this.emit('linkInsert', { url });
    }
  }

  _sanitizeUrl(raw){
    try {
      const u = new URL(raw, location.href);
      if(['http:','https:','mailto:'].includes(u.protocol)) return u.href;
      return null;
    } catch(e){ return null; }
  }

  _onInput(){
    this._updateCharCount();
    this._syncToOriginal();
    this.emit('input', { html: this.getHTML(), text: this.getText() });
  }

  _onPaste(e){
    // paste plaintext if ctrl/shift/meta held? No — we sanitize pasted HTML.
    e.preventDefault();
    const clipboard = (e.clipboardData || window.clipboardData);
    const html = clipboard.getData('text/html');
    const text = clipboard.getData('text/plain');
    let content = html || text;
    if(!content) return;
    const sanitized = this.options.sanitize(content);
    // insert sanitized HTML at selection
    const range = window.getSelection().rangeCount ? window.getSelection().getRangeAt(0) : null;
    if(range){
      range.deleteContents();
      const frag = document.createRange().createContextualFragment(sanitized);
      range.insertNode(frag);
    } else {
      this.editorEl.innerHTML += sanitized;
    }
    this._onInput();
  }

  _onKeydown(e){
    // custom shortcuts
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      this._openLinkDialog();
      return;
    }
    // update button states later
    setTimeout(()=> this._updateToolbarState(), 0);
  }

  _onSelectionChange(){
    // only update when this editor has focus
    const active = document.activeElement === this.editorEl || this.editorEl.contains(document.activeElement);
    if(active) this._updateToolbarState();
  }

  // -----------------------
  // commands & API
  // -----------------------
  exec(command, value = null){
    // normalize a few more readable commands
    switch(command){
      case 'h1': command = 'formatBlock'; value = 'h1'; break;
      case 'h2': command = 'formatBlock'; value = 'h2'; break;
      case 'p': command = 'formatBlock'; value = 'p'; break;
      case 'ul': command = 'insertUnorderedList'; break;
      case 'ol': command = 'insertOrderedList'; break;
      case 'blockquote': command = 'formatBlock'; value = 'blockquote'; break;
    }
    try {
      document.execCommand(command, false, value);
      this._updateToolbarState();
      this.emit('exec', { command, value });
    } catch(e){
      console.warn('execCommand failed:', e);
    }
  }

  getHTML(){
    return this.options.sanitize(this.editorEl.innerHTML);
  }

  setHTML(html){
    this.editorEl.innerHTML = html || '';
    this._updateCharCount();
    this._syncToOriginal();
  }

  getText(){
    return this.editorEl.innerText || '';
  }

  clear(){
    this.editorEl.innerHTML = '<p></p>';
    this._updateCharCount();
    this._syncToOriginal();
    this.emit('clear');
  }

  focus(){ this.editorEl.focus(); }

  destroy(){
    // remove listeners
    this.toolbarEl.removeEventListener('click', this._onToolbarClick);
    this.editorEl.removeEventListener('input', this._onInput);
    this.editorEl.removeEventListener('paste', this._onPaste);
    this.editorEl.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('selectionchange', this._onSelectionChange);
    if(this._imageInput) this._imageInput.removeEventListener('change', this._onImageSelected);
    // remove container and restore original node if any
    if(this.originalInput){
      this.originalInput.style.display = '';
    }
    // detach container from DOM (optionally keep content)
    if(this.container && this.container.parentNode){
      this.container.parentNode.replaceChild(this.originalInput || document.createTextNode(this.getHTML()), this.container);
    }
    this.emit('destroy');
  }

  on(eventName, fn){ (this.events[eventName] = this.events[eventName] || []).push(fn); }
  off(eventName, fn){ this.events[eventName] = (this.events[eventName]||[]).filter(x=>x!==fn); }
  emit(eventName, payload = {}){ (this.events[eventName]||[]).forEach(fn => { try{ fn(payload); }catch(e){console.error(e);} }); }

  _callHook(hookName, ...args){
    // plugin hooks: each plugin may implement function(hookName, editor, ...args)
    this.plugins.forEach(p => {
      if(typeof p[hookName] === 'function') try{ p[hookName](this, ...args); } catch(e){ console.error(e); }
    });
  }

  registerPlugin(plugin){
    // plugin: object with hooks (init, destroy, command, etc.)
    this.plugins.push(plugin);
    if(typeof plugin.init === 'function') plugin.init(this);
  }

  // -----------------------
  // helpers & UI sync
  // -----------------------
  _updateCharCount(){
    const text = (this.editorEl.innerText || '').trim();
    this.charCountEl.textContent = (text.length) ? `${text.length} characters` : '0 characters';
  }

  _syncToOriginal(){
    if(this.originalInput){
      // keep original input in sync (use innerHTML)
      this.originalInput.value = this.getHTML();
    }
  }

  _updateToolbarState(){
    // update `aria-pressed` style on common commands
    ['bold','italic','underline','insertUnorderedList','insertOrderedList'].forEach(cmd => {
      const state = document.queryCommandState(cmd);
      const btn = this.buttons[cmd] || this.buttons[cmd.replace(/insert/,'')];
      if(btn) btn.setAttribute('aria-pressed', state ? 'true' : 'false');
    });
  }

} // end class

// exported factory
export function createMiniEditor(selectorOrNode, options){
  return new MiniEditor(selectorOrNode, options);
}
