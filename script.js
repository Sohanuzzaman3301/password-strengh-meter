// Minimal client-side password strength estimator
(function(){
  const password = document.getElementById('password');
  const meterBar = document.getElementById('meterBar');
  const strengthText = document.getElementById('strengthText');
  const adviceList = document.getElementById('adviceList');
  const scoreText = document.getElementById('scoreText');
  const showToggle = document.getElementById('showToggle');
  const themeToggle = document.getElementById('themeToggle');

  // theme: follow system by default, but allow manual toggle (persisted)
  const root = document.documentElement;
  let systemListener = null;

  function applyTheme(mode){
    const isDark = mode === 'dark';
    if(isDark){
      root.setAttribute('data-theme','dark');
      themeToggle.textContent = 'Light Mode';
      themeToggle.setAttribute('aria-pressed','true');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.textContent = 'Dark Mode';
      themeToggle.setAttribute('aria-pressed','false');
    }
  }

  const stored = localStorage.getItem('theme');
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  if(stored === 'dark' || stored === 'light'){
    applyTheme(stored);
  } else {
    // follow system
    applyTheme(mq && mq.matches ? 'dark' : 'light');
    if(mq && mq.addEventListener){
      systemListener = (e)=> applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', systemListener);
    } else if(mq && mq.addListener){
      systemListener = (e)=> applyTheme(e.matches ? 'dark' : 'light');
      mq.addListener(systemListener);
    }
  }

  themeToggle.addEventListener('click', ()=>{
    const isDarkNow = root.getAttribute('data-theme') === 'dark';
    if(isDarkNow){
      // switch to light and persist
      applyTheme('light');
      localStorage.setItem('theme','light');
    } else {
      applyTheme('dark');
      localStorage.setItem('theme','dark');
    }
    // once user picks, stop following system
    if(mq){
      try{ if(mq.removeEventListener && systemListener) mq.removeEventListener('change', systemListener); }
      catch(e){}
      try{ if(mq.removeListener && systemListener) mq.removeListener(systemListener); }
      catch(e){}
      systemListener = null;
    }
  });

  // show/hide password
  showToggle.addEventListener('click', ()=>{
    const isShown = showToggle.getAttribute('aria-pressed') === 'true';
    if(isShown){
      password.type = 'password';
      showToggle.setAttribute('aria-pressed','false');
      showToggle.textContent = 'Show';
    } else {
      password.type = 'text';
      showToggle.setAttribute('aria-pressed','true');
      showToggle.textContent = 'Hide';
    }
    password.focus();
  });

  // scoring function — small, fast heuristic
  function scorePassword(pw){
    let score = 0;
    if(!pw) return {score:0, label:'Empty', advice:[]};

    // length
    score += Math.min(40, pw.length * 4);

    // variety
    const sets = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/];
    let variety = 0;
    sets.forEach(r=>{ if(r.test(pw)) variety += 1 });
    score += variety * 15;

    // repeated characters penalty
    const repeats = pw.length - pw.replace(/(.)\1+/g, '$1').length;
    score -= Math.min(20, repeats * 2);

    // common patterns penalty (very small list)
    const lowers = pw.toLowerCase();
    const commons = ['password','1234','qwerty','admin','letmein','1111','abcd'];
    commons.forEach(c=>{ if(lowers.includes(c)) score -= 30 });

    // clamp
    score = Math.max(0, Math.min(100, Math.round(score)));

    let label = 'Very weak', color = getComputedStyle(document.documentElement).getPropertyValue('--meter-weak') || '#ef4444';
    if(score >= 80){ label = 'Strong'; color = getComputedStyle(document.documentElement).getPropertyValue('--meter-strong') || '#06b6d4' }
    else if(score >= 60){ label = 'Good'; color = getComputedStyle(document.documentElement).getPropertyValue('--meter-good') || '#10b981' }
    else if(score >= 40){ label = 'Fair'; color = getComputedStyle(document.documentElement).getPropertyValue('--meter-fair') || '#f59e0b' }

    const advice = [];
    if(pw.length < 8) advice.push('Make it longer (8+ characters)');
    if(!/[A-Z]/.test(pw)) advice.push('Add uppercase letters');
    if(!/[a-z]/.test(pw)) advice.push('Add lowercase letters');
    if(!/[0-9]/.test(pw)) advice.push('Add numbers');
    if(!/[^A-Za-z0-9]/.test(pw)) advice.push('Add symbols like !@#$%');
    if(commons.some(c=>lowers.includes(c))) advice.push('Avoid common words or sequences');

    return {score,label,color:color.trim(),advice:advice.slice(0,5)};
  }

  function render(){
    const pw = password.value || '';
    const result = scorePassword(pw);
    // animate meter and update ARIA attributes for accessibility
    meterBar.style.width = result.score + '%';
    meterBar.style.background = result.color;
    const meter = meterBar.parentElement;
    if(meter){
      meter.setAttribute('aria-valuenow', String(result.score));
    }
    strengthText.textContent = result.label;
    scoreText.textContent = result.score ? result.score + '/100' : '';

    adviceList.innerHTML = '';
    if(result.advice.length){
      result.advice.forEach(a=>{
        const li = document.createElement('li');
        li.textContent = a;
        adviceList.appendChild(li);
      });
    } else if(!pw){
      const li = document.createElement('li');
      li.textContent = 'Type a password to get guidance.';
      adviceList.appendChild(li);
    }
  }

  password.addEventListener('input', render);
  // initial render
  render();

})();
