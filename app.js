(() => {
'use strict';
const API_KEY=(window.NJR_CONFIG?.TMDB_API_KEY||'').trim(), API='https://api.themoviedb.org/3', IMG='https://image.tmdb.org/t/p/';
const $=id=>document.getElementById(id), state={region:localStorage.getItem('njr-region')||'SA',pages:{},genreId:null,genrePage:1,searchPage:1,searchQuery:'',searchTimer:null,hero:null,currentMovieId:null,currentMovieTitle:''};
const configs={trending:{path:'/trending/movie/day',target:'trendingMovies',params:{}},hindi:{path:'/discover/movie',target:'hindiMovies',params:{with_original_language:'hi',sort_by:'popularity.desc','vote_count.gte':5}},bangla:{path:'/discover/movie',target:'banglaMovies',params:{with_original_language:'bn',sort_by:'popularity.desc','vote_count.gte':1}},south:{path:'/discover/movie',target:'southMovies',params:{with_original_language:'ta|te|ml|kn',sort_by:'popularity.desc','vote_count.gte':5}},popular:{path:'/movie/popular',target:'popularMovies',params:{}},toprated:{path:'/movie/top_rated',target:'topRatedMovies',params:{}},korean:{path:'/discover/movie',target:'koreanMovies',params:{with_original_language:'ko',sort_by:'popularity.desc','vote_count.gte':5}},upcoming:{path:'/movie/upcoming',target:'upcomingMovies',params:{}}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const supabaseClient=(window.supabase&&window.NJR_CONFIG?.SUPABASE_URL&&window.NJR_CONFIG?.SUPABASE_PUBLISHABLE_KEY)?window.supabase.createClient(window.NJR_CONFIG.SUPABASE_URL,window.NJR_CONFIG.SUPABASE_PUBLISHABLE_KEY):null;
const customMovieCache=new Map();
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.remove('show'),2800)}
async function api(path,params={}){if(!API_KEY)throw Error('TMDB API key missing in config.js');const q=new URLSearchParams({api_key:API_KEY,region:state.region,include_adult:'false',...params});const r=await fetch(`${API}${path}?${q}`);if(!r.ok){let msg=`TMDB error ${r.status}`;try{msg=(await r.json()).status_message||msg}catch{}throw Error(msg)}return r.json()}
const img=(p,size='w342')=>p?`${IMG}${size}${p}`:'';
function card(m){const title=m.title||m.name||'Untitled',year=(m.release_date||m.first_air_date||'').slice(0,4)||'Year unknown',poster=img(m.poster_path),rating=Number(m.vote_average||0);return `<article class="movie-card" tabindex="0" role="button" data-movie-id="${Number(m.id)}" data-media-type="${m.media_type==='tv'?'tv':'movie'}"><div class="poster-wrap">${poster?`<img loading="lazy" src="${poster}" alt="${esc(title)} poster" onerror="this.outerHTML='<div class=&quot;poster-placeholder&quot;>Poster unavailable</div>'">`:`<div class="poster-placeholder">${esc(title)}</div>`}<span class="rating-badge">★ ${rating?rating.toFixed(1):'—'}</span></div><div class="card-title">${esc(title)}</div><div class="card-subtitle">${esc(year)} <span>·</span> ${m.original_language?esc(m.original_language.toUpperCase()):'MOVIE'}</div></article>`}
function render(target,items,append=false){const el=$(target);if(!append)el.innerHTML='';if(!items?.length&&!append){el.innerHTML='<div class="loading">No titles found. Try another category or search.</div>';return}el.insertAdjacentHTML('beforeend',(items||[]).map(card).join(''))}
async function loadShelf(key,append=false){const c=configs[key],page=append?(state.pages[key]||1)+1:1,el=$(c.target),button=document.querySelector(`[data-more="${key}"]`);if(!append)state.pages[key]=0;if(button){button.disabled=true;button.textContent='Loading…'}if(!append)el.innerHTML='<div class="loading">Finding movies for you…</div>';try{let path=c.path,params={...c.params,page};if(key==='trending')path=`/trending/movie/${document.querySelector('[data-trend].active')?.dataset.trend||'day'}`;const d=await api(path,params);render(c.target,d.results||[],append);state.pages[key]=page;if(button){button.classList.toggle('hidden',page>=Math.min(d.total_pages||1,500));button.textContent='Load more '+({hindi:'Hindi',bangla:'Bangla',south:'South Indian',korean:'Korean',toprated:'top-rated',upcoming:'upcoming',popular:'popular',trending:'trending'}[key]||'movies')+' +'}}catch(e){if(!append)el.innerHTML=`<div class="loading">${esc(e.message)}. Check internet/API key.</div>`;toast(`Could not load ${key} movies`)}finally{if(button)button.disabled=false}}
function setHero(m){if(!m)return;state.hero=m;const back=img(m.backdrop_path,'original')||img(m.poster_path,'w780');$('hero').style.setProperty('--hero-image',back?`url("${back}")`:'none');$('heroRating').textContent=`★ ${Number(m.vote_average||0).toFixed(1)} / 10`;$('heroYear').textContent=(m.release_date||'').slice(0,4)||'Featured pick';$('heroTitle').textContent=m.title||m.name||'Featured movie';$('heroExplore').onclick=()=>openMovie(m.id,'movie');$('heroTrailer').onclick=()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((m.title||m.name)+' official trailer')}`,'_blank','noopener')}
async function loadGenres(){try{const d=await api('/genre/movie/list');$('genres').innerHTML=d.genres.map(g=>`<button class="genre-chip" data-genre-id="${g.id}" data-genre-name="${esc(g.name)}">${esc(g.name)} <span>↗</span></button>`).join('')}catch(e){$('genres').innerHTML=`<div class="loading">${esc(e.message)}</div>`}}
async function showGenre(id,name,append=false){state.genreId=id;const page=append?state.genrePage+1:1;$('genreResultsWrap').classList.remove('hidden');$('genreTitle').textContent=`${name} movies`;try{const d=await api('/discover/movie',{with_genres:id,sort_by:'popularity.desc',page});render('genreResults',d.results,append);state.genrePage=page;$('genreMore').classList.toggle('hidden',page>=(d.total_pages||1))}catch(e){toast('Could not load genre movies')} }
async function search(q,append=false){q=q.trim();if(!q){$('searchResults').innerHTML='';$('searchCount').textContent='Search titles from the TMDB catalogue.';$('searchMore').classList.add('hidden');return}if(!append){state.searchQuery=q;state.searchPage=1;$('searchResults').innerHTML='<div class="loading">Searching worldwide catalogue…</div>'}const page=append?state.searchPage+1:1;$('searchPanel').classList.remove('hidden');try{const d=await api('/search/movie',{query:q,page});if(state.searchQuery!==q)return;render('searchResults',d.results,append);state.searchPage=page;$('searchCount').textContent=`${d.total_results.toLocaleString()} results for “${q}” · Page ${page}`;$('searchMore').classList.toggle('hidden',page>=(d.total_pages||1))}catch(e){$('searchResults').innerHTML=`<div class="loading">${esc(e.message)}</div>`}}

async function loadCustomMovies(){
 const host=$('customMovies'); if(!host)return;
 if(!supabaseClient){host.innerHTML='<div class="loading">NJR Library is not configured.</div>';return;}
 try{
  const {data,error}=await supabaseClient.from('movies').select('id,title,year,description,poster_path,video_url,watch_url,category,created_at').eq('published',true).order('created_at',{ascending:false}).limit(100);
  if(error)throw error;
  (data||[]).forEach(m=>customMovieCache.set(String(m.id),m));
  if(!data?.length){host.innerHTML='<div class="loading">No owner-added movies yet. New titles added in Admin Panel will appear here.</div>';return;}
  host.innerHTML=data.map(m=>`<article class="custom-movie-card" tabindex="0" role="button" data-custom-movie-id="${esc(m.id)}"><div class="poster-wrap">${m.poster_path?`<img loading="lazy" src="${esc(m.poster_path)}" alt="${esc(m.title)} poster" onerror="this.style.display='none'">`:`<div class="poster-placeholder">${esc(m.title)}</div>`}<span class="custom-play">▶ Details</span></div><div class="card-title">${esc(m.title)}</div><div class="card-subtitle">${esc(m.year||'')}${m.category?` · ${esc(m.category)}`:''}</div></article>`).join('');
 }catch(e){host.innerHTML=`<div class="loading">Could not load NJR Library. Check the movies table and its read policy. (${esc(e.message||'Error')})</div>`;}
}
function openCustomMovie(id){
 const m=customMovieCache.get(String(id)); if(!m)return;
 state.currentMovieId='custom-'+m.id;state.currentMovieTitle=m.title||'Movie';
 $('watchPlayerStage').classList.add('hidden');$('watchPlayerStage').innerHTML='';$('watchPlayerPanel').classList.add('hidden');
 $('movieModal').classList.remove('hidden');document.body.style.overflow='hidden';
 $('modalTitle').textContent=m.title||'Untitled';$('modalOverview').textContent=m.description||'Added to the NJR MOVIES PRO library.';
 $('modalTags').innerHTML=`<span>${esc(m.category||'NJR Library')}</span>`;
 $('modalMeta').innerHTML=`${m.year?`<span>${esc(m.year)}</span>`:''}<span>OWNER ADDED</span>`;
 $('modalBackdropArt').style.backgroundImage=m.poster_path?`linear-gradient(#0005,#0009),url("${m.poster_path}")`:'';
 if(m.poster_path){$('modalPoster').src=m.poster_path;$('modalPoster').classList.remove('poster-empty')}else{$('modalPoster').removeAttribute('src');$('modalPoster').classList.add('poster-empty')}
 $('castList').innerHTML='<span class="loading">Added by NJR RUBAYET.</span>';
 $('providerNote').textContent='Only watch or share videos you own or have permission to distribute.';
 $('freeWatchLinks').innerHTML='';
 $('watchButton').href=m.watch_url||`https://www.google.com/search?q=${encodeURIComponent(m.title+' official watch')}`;
 $('watchButton').style.display=m.watch_url?'inline-flex':'none';$('watchButton').textContent='Watch Now ↗';
 $('movieLinkButton').style.display=m.watch_url?'inline-flex':'none';$('movieLinkButton').href=m.watch_url||'#';$('movieLinkButton').textContent='Open external link ↗';
 $('trailerButton').href=`https://www.youtube.com/results?search_query=${encodeURIComponent(m.title+' official trailer')}`;
 $('watchHereButton').style.display=(m.video_url)?'inline-flex':'none';
 $('watchHereButton').onclick=()=>{openWatchPlayer();$('watchSourceInput').value=m.video_url||'';if(m.video_url)loadWatchSource(m.video_url,false)};
 $('watchSourceInput').value=m.video_url||'';
}

function renderFreeWatchLinks(title,year){
  const q=title+(year?' '+year:'');
  const encoded=encodeURIComponent(q);
  const services=[
    {name:'Plex',label:'Free movies · ads',url:`https://watch.plex.tv/search?query=${encoded}`,icon:'▶'},
    {name:'Shahid',label:'Free titles available',url:`https://shahid.mbc.net/en/search?query=${encoded}`,icon:'ش'},
    {name:'YouTube',label:'Official uploads only',url:`https://www.youtube.com/results?search_query=${encodeURIComponent(q+' official movie')}`,icon:'▶'},
    {name:'JustWatch',label:'Check legal availability',url:`https://www.justwatch.com/${state.region.toLowerCase()}/search?q=${encoded}`,icon:'⌕'}
  ];
  const host=$('freeWatchLinks');
  if(!host)return;
  host.innerHTML=services.map(s=>`<a class="free-watch-link" href="${s.url}" target="_blank" rel="noopener noreferrer"><span class="free-watch-icon">${esc(s.icon)}</span><span class="free-watch-copy"><strong>${esc(s.name)}</strong><small>${esc(s.label)}</small></span><b>Watch Now ↗</b></a>`).join('');
}
async function openMovie(id,type='movie'){ state.currentMovieId=String(id);state.currentMovieTitle='';$('watchPlayerPanel').classList.add('hidden');$('watchPlayerStage').classList.add('hidden');$('watchPlayerStage').innerHTML='';$('watchSourceInput').value='';$('movieModal').classList.remove('hidden');document.body.style.overflow='hidden';$('modalTitle').textContent='Loading details…';$('modalOverview').textContent='Please wait';$('modalPoster').removeAttribute('src');$('modalPoster').classList.add('poster-empty');$('castList').innerHTML='';try{const [d,c]=await Promise.all([api(`/${type}/${id}`,{append_to_response:'videos,watch/providers'}),api(`/${type}/${id}/credits`)]);const title=d.title||d.name||'Untitled',year=(d.release_date||d.first_air_date||'').slice(0,4),back=img(d.backdrop_path,'w1280')||img(d.poster_path,'w780');state.currentMovieTitle=title;$('modalTitle').textContent=title;renderFreeWatchLinks(title,year);$('movieLinkButton').href=`https://movielinkbd.tv/?s=${encodeURIComponent(title+(year?' '+year:''))}`;$('movieLinkButton').target='_blank';$('movieLinkButton').rel='noopener noreferrer';$('movieLinkButton').textContent='🌐 Search on MovieLinkBD ↗';$('movieLinkButton').setAttribute('aria-label',`Search MovieLinkBD directly for ${title}`);const savedSource=localStorage.getItem(`njr-watch-source-${id}`);if(savedSource)$('watchSourceInput').value=savedSource;$('modalOverview').textContent=d.overview||'No synopsis available.';$('modalBackdropArt').style.backgroundImage=back?`url("${back}")`:'';const poster=img(d.poster_path,'w500');if(poster){$('modalPoster').src=poster;$('modalPoster').classList.remove('poster-empty')}else{$('modalPoster').removeAttribute('src');$('modalPoster').classList.add('poster-empty')};$('modalTags').innerHTML=(d.genres||[]).slice(0,4).map(g=>`<span>${esc(g.name)}</span>`).join('');$('modalMeta').innerHTML=`<span class="score">★ ${Number(d.vote_average||0).toFixed(1)} / 10</span>${year?`<span>${year}</span>`:''}${d.runtime?`<span>${d.runtime} min</span>`:''}<span>${esc((d.original_language||'').toUpperCase())}</span>`;const country=d['watch/providers']?.results?.[state.region];const regionNames={SA:'Saudi Arabia',BD:'Bangladesh',IN:'India',US:'United States',GB:'United Kingdom',AE:'United Arab Emirates',CA:'Canada',AU:'Australia',DE:'Germany',FR:'France'};const fallbackWatch=`https://www.google.com/search?q=${encodeURIComponent(`${title} where to watch legally ${regionNames[state.region]||state.region} JustWatch`)}`;$('watchButton').href=country?.link||fallbackWatch;$('watchButton').setAttribute('aria-label',`Find legal streaming options for ${title}`);$('trailerButton').href=`https://www.youtube.com/results?search_query=${encodeURIComponent(title+' official trailer')}`;const cast=(c.cast||[]).slice(0,8);$('castList').innerHTML=cast.length?cast.map(p=>`<div class="cast-person">${p.profile_path?`<img src="${img(p.profile_path,'w185')}" alt="${esc(p.name)}">`:'<div class="cast-avatar"></div>'}<strong>${esc(p.name)}</strong><span>${esc(p.character||'Cast')}</span></div>`).join(''):'<span class="loading">Cast information unavailable.</span>';const providers=[...(country?.flatrate||[]),...(country?.rent||[]),...(country?.buy||[])].filter((p,i,a)=>a.findIndex(x=>x.provider_id===p.provider_id)===i);$('providerNote').textContent=providers.length?`TMDB lists availability in ${state.region}: ${providers.map(p=>p.provider_name).join(', ')}. Check JustWatch for current options.`:`Availability is not listed by TMDB for ${state.region}. Check JustWatch for legal options.`}catch(e){$('modalTitle').textContent='Could not load details';$('modalOverview').textContent=e.message;toast('Could not load details')}}
function closeWatchPlayer(){
  $('watchPlayerPanel').classList.add('hidden');
  $('watchPlayerStage').classList.add('hidden');
  $('watchPlayerStage').innerHTML='';
}
function openWatchPlayer(){
  $('watchPlayerPanel').classList.remove('hidden');
  const saved=state.currentMovieId?localStorage.getItem(`njr-watch-source-${state.currentMovieId}`):'';
  if(saved && !$('watchSourceInput').value) $('watchSourceInput').value=saved;
  $('watchPlayerPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
  if(saved && !$('watchPlayerStage').innerHTML) loadWatchSource(saved,false);
}
function loadWatchSource(raw,save=true){
  const value=(raw||'').trim();
  if(!value){toast('Paste a direct video or supported embed URL first');return}
  let u;try{u=new URL(value)}catch{toast('Please enter a valid URL');return}
  if(!['https:','http:'].includes(u.protocol)){toast('Only http/https links are supported');return}
  const stage=$('watchPlayerStage');stage.innerHTML='';stage.classList.remove('hidden');
  const host=u.hostname.toLowerCase().replace(/^www\./,'');
  const isMovieLinkBD=host==='movielinkbd.com'||host.endsWith('.movielinkbd.com');
  const isDirect=/\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i.test(u.pathname+u.search);
  const isHls=/\.m3u8(\?.*)?$/i.test(u.pathname+u.search);
  const yt=host==='youtu.be'||host==='youtube.com'||host.endsWith('.youtube.com');
  const vimeo=host==='vimeo.com'||host.endsWith('.vimeo.com');
  if(isMovieLinkBD){
    stage.classList.add('hidden');stage.innerHTML='';
    $('watchSourceNote').innerHTML='MovieLinkBD link detected. Its page URL is not a video stream, so it cannot play inside this player. Open the MovieLinkBD page instead, or paste an authorized direct MP4/WebM/HLS URL or supported YouTube/Vimeo link.';
    const link=document.createElement('a');link.href=u.href;link.target='_blank';link.rel='noopener noreferrer';link.className='btn primary';link.textContent='🌐 Open on MovieLinkBD ↗';link.style.marginTop='12px';$('watchPlayerPanel').appendChild(link);
    toast('MovieLinkBD page link opens externally; it is not a video file');return;
  }
  if(isDirect||isHls){
    const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('controlsList','nodownload');
    if(isHls && video.canPlayType('application/vnd.apple.mpegurl')){
      video.src=u.href;
    }else if(isHls){
      const lib=document.createElement('script');lib.src='https://cdn.jsdelivr.net/npm/hls.js@latest';
      lib.onload=()=>{if(window.Hls&&window.Hls.isSupported()){const hls=new window.Hls();hls.loadSource(u.href);hls.attachMedia(video);hls.on(window.Hls.Events.ERROR,(_,data)=>{if(data.fatal)$('watchSourceNote').textContent='HLS playback failed. The source may be unavailable, protected, or block playback.'})}else{$('watchSourceNote').textContent='This browser cannot play this HLS stream. Try an authorized MP4/WebM source.'}};
      lib.onerror=()=>{$('watchSourceNote').textContent='Could not load the HLS player library. Try an authorized MP4/WebM source.'};document.head.appendChild(lib);
    }else video.src=u.href;
    video.addEventListener('error',()=>{$('watchSourceNote').textContent='Video could not play. Check that this is a direct, working video URL and that its host permits streaming. A webpage link will not work.'},{once:true});
    stage.appendChild(video);
  }else if(yt||vimeo){
    let embed='';
    if(yt){let id='';if(host==='youtu.be')id=u.pathname.slice(1);else if(u.pathname.startsWith('/embed/'))id=u.pathname.split('/')[2];else id=u.searchParams.get('v')||'';if(id)embed=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
    if(vimeo){const m=u.pathname.match(/\/(\d+)/);if(m)embed=`https://player.vimeo.com/video/${m[1]}`}
    if(!embed){stage.classList.add('hidden');toast('Could not recognize that video embed URL');return}
    const frame=document.createElement('iframe');frame.src=embed;frame.title='Video player';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';stage.appendChild(frame);
  }else{
    stage.classList.add('hidden');stage.innerHTML='';$('watchSourceNote').textContent='This is a webpage link, not a direct video or supported embed URL. Open the page externally, or paste an authorized MP4/WebM/HLS URL or YouTube/Vimeo link.';toast('This link is a webpage, not a playable video source');return;
  }
  $('watchSourceNote').textContent='If playback fails, the URL may not be a direct video, the host may block streaming, or the video may require access permission.';
  if(save&&state.currentMovieId){localStorage.setItem(`njr-watch-source-${state.currentMovieId}`,u.href);toast('Video source saved for this movie on this device')}
}
$('watchHereButton').addEventListener('click',openWatchPlayer);
$('closeWatchPlayer').addEventListener('click',closeWatchPlayer);
$('playSourceButton').addEventListener('click',()=>loadWatchSource($('watchSourceInput').value,true));
$('watchSourceInput').addEventListener('keydown',e=>{if(e.key==='Enter')loadWatchSource(e.target.value,true)});
function closeModal(){closeWatchPlayer();$('movieModal').classList.add('hidden');document.body.style.overflow=''}
function openAbout(){$('aboutModal').classList.remove('hidden');document.body.style.overflow='hidden'}
function closeAbout(){$('aboutModal').classList.add('hidden');document.body.style.overflow=''}
$('aboutSiteButton').addEventListener('click',openAbout);$('closeAbout').addEventListener('click',closeAbout);$('aboutBackdrop').addEventListener('click',closeAbout);
$('region').value=state.region;$('region').addEventListener('change',()=>{state.region=$('region').value;localStorage.setItem('njr-region',state.region);toast('Streaming region updated');});
$('searchToggle').onclick=()=>{$('searchPanel').classList.toggle('hidden');$('searchInput').focus()};$('closeSearch').onclick=()=>$('searchPanel').classList.add('hidden');$('searchInput').addEventListener('input',e=>{clearTimeout(state.searchTimer);state.searchTimer=setTimeout(()=>search(e.target.value),350)});$('clearSearch').onclick=()=>{$('searchInput').value='';search('');$('searchInput').focus()};$('searchMore').onclick=()=>search(state.searchQuery,true);
document.querySelectorAll('[data-more]').forEach(b=>b.addEventListener('click',()=>loadShelf(b.dataset.more,true)));document.querySelectorAll('[data-trend]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-trend]').forEach(x=>x.classList.toggle('active',x===b));loadShelf('trending',false)}));$('genreMore').onclick=()=>{const b=document.querySelector(`.genre-chip[data-genre-id="${state.genreId}"]`);if(b)showGenre(state.genreId,b.dataset.genreName,true)};$('closeGenre').onclick=()=>$('genreResultsWrap').classList.add('hidden');$('closeModal').onclick=closeModal;$('modalBackdrop').onclick=closeModal;
document.addEventListener('click',e=>{const cm=e.target.closest('[data-custom-movie-id]');if(cm){openCustomMovie(cm.dataset.customMovieId);return}const c=e.target.closest('[data-movie-id]');if(c)openMovie(c.dataset.movieId,c.dataset.mediaType||'movie');const g=e.target.closest('[data-genre-id]');if(g)showGenre(g.dataset.genreId,g.dataset.genreName)});document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.custom-movie-card')){e.preventDefault();openCustomMovie(e.target.dataset.customMovieId)}else if((e.key==='Enter'||e.key===' ')&&e.target.matches('.movie-card')){e.preventDefault();openMovie(e.target.dataset.movieId,e.target.dataset.mediaType||'movie')}if(e.key==='Escape'){closeModal();closeAbout()}});
async function init(){await Promise.all(Object.keys(configs).map(k=>loadShelf(k)));loadCustomMovies();loadGenres();const first=await api('/trending/movie/day').catch(()=>null);if(first?.results?.length)setHero(first.results.find(m=>m.backdrop_path)||first.results[0]);}
init().catch(e=>toast(e.message));
})();