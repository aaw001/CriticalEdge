(function(){
  const groups = Array.from(document.querySelectorAll('.nihss-q'));
  const totalEl = document.getElementById('nihssTotal');
  const doneEl  = document.getElementById('nihssDone');

  function getValue(group){
    const checked = group.querySelector('input[type="radio"]:checked');
    if (!checked) return null;
    const isUT = checked.hasAttribute('data-ut');
    if (isUT) return { val: 0, ut: true }; // UT counts 0 for practice
    const v = Number(checked.value || 0);
    return { val: isNaN(v) ? 0 : v, ut: false };
  }

  function compute(){
    let sum = 0, done = 0, uts = [];
    groups.forEach(g=>{
      const name = g.dataset.key || '';
      const res = getValue(g);
      if (res){ done++; sum += res.val; if (res.ut) uts.push(name); }
    });
    totalEl.textContent = String(sum);
    doneEl.textContent  = String(done);
    return { sum, done, uts };
  }

  function saveState(){
    const state = {};
    groups.forEach(g=>{
      const checked = g.querySelector('input[type="radio"]:checked');
      if (checked){ state[g.dataset.key] = checked.value || 'UT'; }
    });
    try{ localStorage.setItem('nihss_v1', JSON.stringify(state)); }catch(e){}
  }

  function loadState(){
    try{
      const raw = localStorage.getItem('nihss_v1');
      if(!raw) return;
      const state = JSON.parse(raw);
      groups.forEach(g=>{
        const key = g.dataset.key;
        if (state[key] !== undefined){
          const val = state[key];
          const sel = g.querySelector(`input[type="radio"][value="${CSS.escape(val)}"]`)
                   || (val==='UT' ? g.querySelector('input[type="radio"][data-ut]') : null);
          if (sel){ sel.checked = true; }
        }
      });
    }catch(e){}
  }

  function resetAll(){
    groups.forEach(g=>{
      const ch = g.querySelector('input[type="radio"]:checked');
      if (ch) ch.checked = false;
    });
    localStorage.removeItem('nihss_v1');
    compute();
  }

  function copyResult(){
    const { sum, done, uts } = compute();
    const lines = [
      `NIHSS total: ${sum}`,
      `Items completed: ${done}/15`,
      uts.length ? `Untestable: ${uts.join(', ')}` : null
    ].filter(Boolean);
    const txt = lines.join('\n');
    navigator.clipboard?.writeText(txt).then(()=>{
      alert('Copied:\n' + txt);
    }).catch(()=>{
      const ta = document.createElement('textarea');
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); alert('Copied:\n' + txt); }finally{ ta.remove(); }
    });
  }

  document.addEventListener('change', e=>{
    if (e.target.matches('.nihss-q input[type="radio"]')){
      compute(); saveState();
    }
  });

  ['nihssReset','nihssReset2'].forEach(id=>{
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', resetAll);
  });
  ['nihssCopy','nihssCopy2'].forEach(id=>{
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', copyResult);
  });

  loadState(); compute();
})();
