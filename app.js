/* ============================================
   WBC Tracker — App
   ============================================ */

// ---- Constants ----

const API_BASE = 'https://statsapi.mlb.com';
const WBC_SPORT_ID = 51;
const WBC_LEAGUE_ID = 160;
const WBC_SEASON = 2026;
const WBC_START = '2026-03-05';
const WBC_END = '2026-03-17';
const POLL_INTERVAL = 60_000;

// All 30 MLB teams with league/division
const MLB_TEAMS = [
  { id: 110, abbr: 'BAL', name: 'Orioles',       fullName: 'Baltimore Orioles',       color: '#DF4601', color2: '#27251F', league: 'AL', division: 'East' },
  { id: 111, abbr: 'BOS', name: 'Red Sox',       fullName: 'Boston Red Sox',          color: '#BD3039', color2: '#0C2340', league: 'AL', division: 'East' },
  { id: 147, abbr: 'NYY', name: 'Yankees',       fullName: 'New York Yankees',        color: '#003087', color2: '#C4CED4', league: 'AL', division: 'East' },
  { id: 139, abbr: 'TB',  name: 'Rays',          fullName: 'Tampa Bay Rays',          color: '#092C5C', color2: '#8FBCE6', league: 'AL', division: 'East' },
  { id: 141, abbr: 'TOR', name: 'Blue Jays',     fullName: 'Toronto Blue Jays',       color: '#134A8E', color2: '#E8291C', league: 'AL', division: 'East' },
  { id: 145, abbr: 'CWS', name: 'White Sox',     fullName: 'Chicago White Sox',       color: '#27251F', color2: '#C4CED4', league: 'AL', division: 'Central' },
  { id: 114, abbr: 'CLE', name: 'Guardians',     fullName: 'Cleveland Guardians',     color: '#00385D', color2: '#E50022', league: 'AL', division: 'Central' },
  { id: 116, abbr: 'DET', name: 'Tigers',        fullName: 'Detroit Tigers',          color: '#0C2340', color2: '#FA4616', league: 'AL', division: 'Central' },
  { id: 118, abbr: 'KC',  name: 'Royals',        fullName: 'Kansas City Royals',      color: '#004687', color2: '#BD9B60', league: 'AL', division: 'Central' },
  { id: 142, abbr: 'MIN', name: 'Twins',         fullName: 'Minnesota Twins',         color: '#002B5C', color2: '#D31145', league: 'AL', division: 'Central' },
  { id: 117, abbr: 'HOU', name: 'Astros',        fullName: 'Houston Astros',          color: '#002D62', color2: '#EB6E1F', league: 'AL', division: 'West' },
  { id: 108, abbr: 'LAA', name: 'Angels',        fullName: 'Los Angeles Angels',      color: '#BA0021', color2: '#003263', league: 'AL', division: 'West' },
  { id: 133, abbr: 'OAK', name: 'Athletics',     fullName: 'Oakland Athletics',       color: '#003831', color2: '#EFB21E', league: 'AL', division: 'West' },
  { id: 136, abbr: 'SEA', name: 'Mariners',      fullName: 'Seattle Mariners',        color: '#0C2C56', color2: '#005C5C', league: 'AL', division: 'West' },
  { id: 140, abbr: 'TEX', name: 'Rangers',       fullName: 'Texas Rangers',           color: '#003278', color2: '#C0111F', league: 'AL', division: 'West' },
  { id: 144, abbr: 'ATL', name: 'Braves',        fullName: 'Atlanta Braves',          color: '#CE1141', color2: '#13274F', league: 'NL', division: 'East' },
  { id: 146, abbr: 'MIA', name: 'Marlins',       fullName: 'Miami Marlins',           color: '#00A3E0', color2: '#EF3340', league: 'NL', division: 'East' },
  { id: 121, abbr: 'NYM', name: 'Mets',          fullName: 'New York Mets',           color: '#002D72', color2: '#FF5910', league: 'NL', division: 'East' },
  { id: 143, abbr: 'PHI', name: 'Phillies',      fullName: 'Philadelphia Phillies',   color: '#E81828', color2: '#002D72', league: 'NL', division: 'East' },
  { id: 120, abbr: 'WSH', name: 'Nationals',     fullName: 'Washington Nationals',    color: '#AB0003', color2: '#14225A', league: 'NL', division: 'East' },
  { id: 112, abbr: 'CHC', name: 'Cubs',          fullName: 'Chicago Cubs',            color: '#0E3386', color2: '#CC3433', league: 'NL', division: 'Central' },
  { id: 113, abbr: 'CIN', name: 'Reds',          fullName: 'Cincinnati Reds',         color: '#C6011F', color2: '#000000', league: 'NL', division: 'Central' },
  { id: 158, abbr: 'MIL', name: 'Brewers',       fullName: 'Milwaukee Brewers',       color: '#FFC52F', color2: '#12284B', league: 'NL', division: 'Central' },
  { id: 134, abbr: 'PIT', name: 'Pirates',       fullName: 'Pittsburgh Pirates',      color: '#27251F', color2: '#FDB827', league: 'NL', division: 'Central' },
  { id: 138, abbr: 'STL', name: 'Cardinals',     fullName: 'St. Louis Cardinals',     color: '#C41E3A', color2: '#0C2340', league: 'NL', division: 'Central' },
  { id: 109, abbr: 'AZ',  name: 'D-backs',      fullName: 'Arizona Diamondbacks',    color: '#A71930', color2: '#E3D4AD', league: 'NL', division: 'West' },
  { id: 115, abbr: 'COL', name: 'Rockies',       fullName: 'Colorado Rockies',        color: '#33006F', color2: '#C4CED4', league: 'NL', division: 'West' },
  { id: 119, abbr: 'LAD', name: 'Dodgers',       fullName: 'Los Angeles Dodgers',     color: '#005A9C', color2: '#EF3E42', league: 'NL', division: 'West' },
  { id: 135, abbr: 'SD',  name: 'Padres',        fullName: 'San Diego Padres',        color: '#2F241D', color2: '#FFC425', league: 'NL', division: 'West' },
  { id: 137, abbr: 'SF',  name: 'Giants',        fullName: 'San Francisco Giants',    color: '#FD5A1E', color2: '#27251F', league: 'NL', division: 'West' },
];

// Country code → emoji flag mapping
const COUNTRY_FLAGS = {
  'Australia': '\u{1F1E6}\u{1F1FA}', 'Brazil': '\u{1F1E7}\u{1F1F7}', 'Canada': '\u{1F1E8}\u{1F1E6}',
  'Chinese Taipei': '\u{1F3F4}', 'Colombia': '\u{1F1E8}\u{1F1F4}', 'Cuba': '\u{1F1E8}\u{1F1FA}',
  'Czechia': '\u{1F1E8}\u{1F1FF}', 'Czech Republic': '\u{1F1E8}\u{1F1FF}',
  'Dominican Republic': '\u{1F1E9}\u{1F1F4}', 'Great Britain': '\u{1F1EC}\u{1F1E7}',
  'Israel': '\u{1F1EE}\u{1F1F1}', 'Italy': '\u{1F1EE}\u{1F1F9}', 'Japan': '\u{1F1EF}\u{1F1F5}',
  'Mexico': '\u{1F1F2}\u{1F1FD}', 'Kingdom of the Netherlands': '\u{1F1F3}\u{1F1F1}',
  'Netherlands': '\u{1F1F3}\u{1F1F1}', 'Nicaragua': '\u{1F1F3}\u{1F1EE}',
  'Panama': '\u{1F1F5}\u{1F1E6}', 'Puerto Rico': '\u{1F1F5}\u{1F1F7}',
  'United States': '\u{1F1FA}\u{1F1F8}', 'Venezuela': '\u{1F1FB}\u{1F1EA}',
  'Korea': '\u{1F1F0}\u{1F1F7}', 'South Korea': '\u{1F1F0}\u{1F1F7}',
};

// Short display names for WBC teams
const WBC_SHORT_NAMES = {
  'Kingdom of the Netherlands': 'Netherlands',
  'Chinese Taipei': 'Chinese Taipei',
  'Dominican Republic': 'Dominican Rep.',
};

// ---- Telemetry (TelemetryDeck) ----

const TD_APP_ID = '96D700D3-5F10-4BFB-BAAE-63A484584A7D';
const TD_INGEST = 'https://nom.telemetrydeck.com/v2/';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const telemetry = {
  _sessionID: generateUUID(),

  async _getUserHash() {
    if (this._userHash) return this._userHash;
    let uid;
    try { uid = localStorage.getItem('wbc_uid'); } catch {}
    if (!uid) {
      uid = generateUUID();
      try { localStorage.setItem('wbc_uid', uid); } catch {}
    }
    if (crypto.subtle) {
      const encoded = new TextEncoder().encode(uid);
      const hash = await crypto.subtle.digest('SHA-256', encoded);
      this._userHash = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback: simple hash for non-secure contexts
      this._userHash = uid.replace(/-/g, '');
    }
    return this._userHash;
  },

  async signal(type, payload = {}) {
    try {
      const clientUser = await this._getUserHash();
      await fetch(TD_INGEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          appID: TD_APP_ID,
          clientUser,
          sessionID: this._sessionID,
          type,
          payload,
        }]),
      });
    } catch {
      // Telemetry should never break the app
    }
  },
};

// Global error tracking
window.addEventListener('error', (e) => {
  telemetry.signal('error.javascript', {
    message: e.message || 'Unknown error',
    source: e.filename || '',
    line: String(e.lineno || ''),
    col: String(e.colno || ''),
  });
});

window.addEventListener('unhandledrejection', (e) => {
  telemetry.signal('error.unhandledRejection', {
    message: String(e.reason || 'Unknown rejection'),
  });
});

// ---- State ----

let state = {
  schedule: [],         // all WBC games
  teamPlayerMap: null,  // Map<mlbTeamId, [{playerId, playerName, wbcTeamId, wbcTeamName, position}]>
  wbcTeams: [],         // [{id, name}]
  selectedTeamId: null,
  selectedDate: null,
  pollTimer: null,
};

// ---- DOM refs ----

const $ = (sel) => document.querySelector(sel);
const screens = {
  loading: $('#loading-screen'),
  teamSelect: $('#team-select-screen'),
  teamView: $('#team-view-screen'),
  roster: $('#roster-screen'),
  error: $('#error-screen'),
};

// ---- API Layer ----

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const signalType = res.status === 429 ? 'error.rateLimited' : 'error.api';
    telemetry.signal(signalType, {
      status: String(res.status),
      statusText: res.statusText,
      path,
    });
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchWBCTeams() {
  const data = await apiFetch(`/api/v1/teams?sportId=${WBC_SPORT_ID}&leagueIds=${WBC_LEAGUE_ID}&season=${WBC_SEASON}`);
  return data.teams.map(t => ({ id: t.id, name: t.teamName || t.name }));
}

async function fetchRoster(wbcTeamId) {
  const data = await apiFetch(`/api/v1/teams/${wbcTeamId}/roster?season=${WBC_SEASON}&rosterType=fullRoster`);
  return { wbcTeamId, roster: data.roster || [] };
}

async function fetchSchedule() {
  const data = await apiFetch(
    `/api/v1/schedule?sportId=${WBC_SPORT_ID}&leagueId=${WBC_LEAGUE_ID}&startDate=${WBC_START}&endDate=${WBC_END}&hydrate=team,linescore,broadcasts`
  );
  const games = [];
  for (const dateEntry of (data.dates || [])) {
    for (const game of (dateEntry.games || [])) {
      games.push(game);
    }
  }
  return games;
}

async function refreshSchedule() {
  try {
    const games = await fetchSchedule();
    state.schedule = games;
    if (state.selectedTeamId && state.selectedDate) {
      renderGames();
    }
  } catch (e) {
    // Silent fail on refresh — we still have old data
    console.warn('Schedule refresh failed:', e);
    telemetry.signal('error.scheduleRefresh', { message: e.message || 'Unknown' });
  }
}

// ---- Data Processing ----

function buildTeamPlayerMap(wbcTeams, rosterResults) {
  const map = new Map(); // mlbTeamId → [{...}]
  const wbcTeamLookup = new Map(wbcTeams.map(t => [t.id, t.name]));

  for (const { wbcTeamId, roster } of rosterResults) {
    const wbcTeamName = wbcTeamLookup.get(wbcTeamId) || 'Unknown';
    for (const player of roster) {
      const mlbTeamId = player.parentTeamId;
      if (!mlbTeamId) continue;

      const entry = {
        playerId: player.person.id,
        playerName: player.person.fullName,
        wbcTeamId,
        wbcTeamName,
        position: player.position?.abbreviation || player.position?.name || '',
      };

      if (!map.has(mlbTeamId)) map.set(mlbTeamId, []);
      map.get(mlbTeamId).push(entry);
    }
  }

  return map;
}

function getGamesForTeamOnDate(mlbTeamId, dateStr) {
  const players = state.teamPlayerMap?.get(mlbTeamId) || [];
  if (players.length === 0) return [];

  // Which WBC team IDs have players from this MLB team?
  const wbcTeamIds = new Set(players.map(p => p.wbcTeamId));

  // Filter schedule for this date and these WBC teams
  return state.schedule
    .filter(game => {
      const gameDate = game.officialDate || game.gameDate?.slice(0, 10);
      if (gameDate !== dateStr) return false;
      const awayId = game.teams?.away?.team?.id;
      const homeId = game.teams?.home?.team?.id;
      return wbcTeamIds.has(awayId) || wbcTeamIds.has(homeId);
    })
    .map(game => {
      const awayId = game.teams.away.team.id;
      const homeId = game.teams.home.team.id;
      const awayName = game.teams.away.team.name || game.teams.away.team.teamName || '';
      const homeName = game.teams.home.team.name || game.teams.home.team.teamName || '';

      const awayPlayers = players.filter(p => p.wbcTeamId === awayId);
      const homePlayers = players.filter(p => p.wbcTeamId === homeId);

      return {
        gamePk: game.gamePk,
        gameDate: game.gameDate,
        status: game.status?.detailedState || 'Scheduled',
        statusCode: game.status?.statusCode,
        away: { id: awayId, name: awayName, score: game.teams.away.score, players: awayPlayers },
        home: { id: homeId, name: homeName, score: game.teams.home.score, players: homePlayers },
        venue: game.venue?.name || '',
        description: game.description || '',
        linescore: game.linescore,
        tvNetworks: getTVNetworks(game.broadcasts),
      };
    })
    .sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
}

// ---- Rendering ----

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el.classList.toggle('active', key === name);
  }
}

function renderTeamGrid() {
  const grid = $('#team-grid');
  const leagues = ['AL', 'NL'];
  const divisions = ['East', 'Central', 'West'];

  let html = '';
  let cardIndex = 0;

  for (const league of leagues) {
    html += `<div class="division-league-label">${league === 'AL' ? 'American League' : 'National League'}</div>`;
    for (const division of divisions) {
      html += `<div class="division-label">${division}</div>`;
      html += '<div class="division-grid">';
      const teams = MLB_TEAMS
        .filter(t => t.league === league && t.division === division)
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
      for (const team of teams) {
        const count = state.teamPlayerMap?.get(team.id)?.length || 0;
        html += `
          <div class="team-card" data-team-id="${team.id}" role="button" tabindex="0"
               aria-label="${team.fullName}, ${count} players in WBC"
               style="animation-delay: ${cardIndex * 0.03}s">
            <div class="team-badge" style="background: ${team.color};">${team.abbr}</div>
            <div class="team-card-name">${team.fullName}</div>
          </div>
        `;
        cardIndex++;
      }
      html += '</div>';
    }
  }

  grid.innerHTML = html;

  // Event listeners
  grid.querySelectorAll('.team-card').forEach(card => {
    const handler = () => selectTeam(parseInt(card.dataset.teamId));
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

function selectTeam(teamId) {
  state.selectedTeamId = teamId;
  state.selectedDate = todayStr();
  const team = MLB_TEAMS.find(t => t.id === teamId);
  if (team) {
    telemetry.signal('team.selected', { team: team.abbr, teamName: team.fullName });
  }
  try { localStorage.setItem('wbc_team', teamId); } catch {}
  updateURL();
  renderTeamView();
  showScreen('teamView');
}

function renderTeamView() {
  const team = MLB_TEAMS.find(t => t.id === state.selectedTeamId);
  if (!team) return;

  // Header badge
  const badge = $('#team-badge-header');
  badge.style.background = team.color;
  badge.textContent = team.abbr;

  // Team name
  $('#team-name-header').textContent = team.fullName;

  // Player count (clickable link to roster)
  const players = state.teamPlayerMap?.get(team.id) || [];
  const wbcTeamCount = new Set(players.map(p => p.wbcTeamId)).size;
  const countEl = $('#player-count');
  if (players.length > 0) {
    countEl.innerHTML = `<a href="#" id="roster-link" class="roster-link">${players.length} player${players.length !== 1 ? 's' : ''} across ${wbcTeamCount} WBC team${wbcTeamCount !== 1 ? 's' : ''}</a>`;
    $('#roster-link').addEventListener('click', (e) => {
      e.preventDefault();
      showRoster();
    });
  } else {
    countEl.textContent = 'No players in the WBC';
  }

  // Date
  renderDate();
  renderGames();
}

function renderDate() {
  const dateStr = state.selectedDate;
  const input = $('#date-input');
  input.value = dateStr;

  const date = parseLocalDate(dateStr);
  const isToday = dateStr === todayStr();

  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  $('#date-label').innerHTML = formatted + (isToday ? '<span class="today-badge">Today</span>' : '');
}

function renderGames() {
  const container = $('#games-container');
  const games = getGamesForTeamOnDate(state.selectedTeamId, state.selectedDate);

  if (games.length === 0) {
    const team = MLB_TEAMS.find(t => t.id === state.selectedTeamId);
    container.innerHTML = `
      <div class="no-games">
        <div class="no-games-icon">\u26BE</div>
        <h3>No games on this date</h3>
        <p>No ${team?.name || 'team'} players have WBC games scheduled for this day.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = games.map((game, i) => renderGameCard(game, i)).join('');
}

function renderGameCard(game, index) {
  const awayFlag = getFlag(game.away.name);
  const homeFlag = getFlag(game.home.name);
  const awayShort = getShortName(game.away.name);
  const homeShort = getShortName(game.home.name);

  // Status display
  let statusHTML = '';
  let scoreHTML = '<span class="game-vs">vs</span>';

  const isLive = ['In Progress', 'Top', 'Bottom', 'Middle', 'End'].some(s =>
    game.status?.includes(s) || game.statusCode === 'I'
  );
  const isFinal = game.status === 'Final' || game.status === 'Game Over' || game.statusCode === 'F';

  if (isLive) {
    const inning = game.linescore?.currentInningOrdinal || '';
    const halfInning = game.linescore?.inningHalf || '';
    statusHTML = `<span class="game-status-badge live">${halfInning} ${inning}</span>`;
    scoreHTML = `<span class="game-score-center">${game.away.score ?? 0} - ${game.home.score ?? 0}</span>`;
  } else if (isFinal) {
    statusHTML = `<span class="game-status-badge final">Final</span>`;
    scoreHTML = `<span class="game-score-center">${game.away.score ?? 0} - ${game.home.score ?? 0}</span>`;
  } else {
    const gameTime = new Date(game.gameDate);
    const time = gameTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const tz = gameTime.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();
    statusHTML = `<span class="game-status-badge">${time} ${tz}</span>`;
  }

  // Meta line
  const metaParts = [statusHTML];
  if (game.tvNetworks) metaParts.push(game.tvNetworks);
  if (game.venue) metaParts.push(game.venue);
  if (game.description) metaParts.push(game.description);

  // Player sections — two columns aligned under away/home
  let playersHTML = '';
  if (game.away.players.length > 0 || game.home.players.length > 0) {
    playersHTML = `
      <div class="game-players-row">
        <div class="game-players-col away">
          ${game.away.players.length > 0 ? renderPlayersSide(game.away.players) : ''}
        </div>
        <div class="game-players-col home">
          ${game.home.players.length > 0 ? renderPlayersSide(game.home.players) : ''}
        </div>
      </div>
    `;
  }

  return `
    <div class="game-card" style="animation-delay: ${index * 0.06}s">
      <div class="game-card-top">
        <div class="game-matchup">
          <div class="game-team away">
            <span class="game-team-flag">${awayFlag}</span>
            <span class="game-team-name">${awayShort}</span>
          </div>
          ${scoreHTML}
          <div class="game-team home">
            <span class="game-team-name">${homeShort}</span>
            <span class="game-team-flag">${homeFlag}</span>
          </div>
        </div>
        <div class="game-meta">
          ${metaParts.join('<span class="game-meta-sep">\u00B7</span>')}
        </div>
      </div>
      ${playersHTML}
    </div>
  `;
}

function playerHeadshotURL(playerId) {
  return `https://content.mlb.com/images/headshots/current/60x60/${playerId}@2x.png`;
}

function renderPlayersSide(players) {
  return players.map(p => `
    <div class="game-player">
      <img class="player-headshot" src="${playerHeadshotURL(p.playerId)}" alt="" loading="lazy" onerror="this.style.display='none'">
      <span class="player-name">${p.playerName}</span>
      <span class="player-position">${p.position}</span>
    </div>
  `).join('');
}

// ---- Roster Screen ----

function showRoster() {
  const team = MLB_TEAMS.find(t => t.id === state.selectedTeamId);
  if (!team) return;

  // Header
  $('#roster-badge').style.background = team.color;
  $('#roster-badge').textContent = team.abbr;
  $('#roster-team-name').textContent = team.fullName;

  const players = state.teamPlayerMap?.get(team.id) || [];
  const wbcTeamCount = new Set(players.map(p => p.wbcTeamId)).size;
  $('#roster-subtitle').textContent = `${players.length} player${players.length !== 1 ? 's' : ''} across ${wbcTeamCount} WBC team${wbcTeamCount !== 1 ? 's' : ''}`;

  // Group players by WBC team
  const byWbcTeam = new Map();
  for (const p of players) {
    if (!byWbcTeam.has(p.wbcTeamId)) {
      byWbcTeam.set(p.wbcTeamId, { name: p.wbcTeamName, players: [] });
    }
    byWbcTeam.get(p.wbcTeamId).players.push(p);
  }

  // Sort WBC teams alphabetically, then players within each team
  const sorted = [...byWbcTeam.values()].sort((a, b) => a.name.localeCompare(b.name));

  const container = $('#roster-container');
  container.innerHTML = sorted.map((wbcTeam, i) => {
    const flag = getFlag(wbcTeam.name);
    const shortName = getShortName(wbcTeam.name);
    const playerRows = wbcTeam.players
      .sort((a, b) => a.playerName.localeCompare(b.playerName))
      .map(p => `
        <div class="roster-player">
          <img class="player-headshot" src="${playerHeadshotURL(p.playerId)}" alt="" loading="lazy" onerror="this.style.display='none'">
          <span class="player-name">${p.playerName}</span>
          <span class="player-position">${p.position}</span>
        </div>
      `).join('');

    return `
      <div class="roster-group" style="animation-delay: ${i * 0.05}s">
        <div class="roster-group-header">
          <span class="roster-group-flag">${flag}</span>
          <span class="roster-group-name">${shortName}</span>
        </div>
        ${playerRows}
      </div>
    `;
  }).join('');

  showScreen('roster');
}

// ---- Helpers ----

function getTVNetworks(broadcasts) {
  if (!broadcasts) return '';
  const tvNames = [...new Set(
    broadcasts
      .filter(b => b.type === 'TV' && b.language === 'en')
      .map(b => b.callSign || b.name)
  )];
  return tvNames.join(', ');
}

function getFlag(teamName) {
  return COUNTRY_FLAGS[teamName] || '\u{1F3F3}\u{FE0F}';
}

function getShortName(name) {
  return WBC_SHORT_NAMES[name] || name;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function shiftDate(dateStr, days) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---- URL / Routing ----

function readURL() {
  const params = new URLSearchParams(window.location.search);
  const teamAbbr = params.get('team');
  const date = params.get('date');

  if (teamAbbr) {
    const team = MLB_TEAMS.find(t => t.abbr.toLowerCase() === teamAbbr.toLowerCase());
    if (team) state.selectedTeamId = team.id;
  } else {
    // Fall back to last-selected team from localStorage
    try {
      const saved = localStorage.getItem('wbc_team');
      if (saved) {
        const id = parseInt(saved);
        if (MLB_TEAMS.some(t => t.id === id)) state.selectedTeamId = id;
      }
    } catch {}
  }
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    state.selectedDate = date;
  }
}

function updateURL() {
  const team = MLB_TEAMS.find(t => t.id === state.selectedTeamId);
  if (!team) return;

  const params = new URLSearchParams();
  params.set('team', team.abbr);
  if (state.selectedDate) params.set('date', state.selectedDate);

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newURL);
}

// ---- Event Handlers ----

function setupEvents() {
  // Back button
  $('#back-btn').addEventListener('click', () => {
    state.selectedTeamId = null;
    try { localStorage.removeItem('wbc_team'); } catch {}
    window.history.pushState({}, '', window.location.pathname);
    showScreen('teamSelect');
  });

  // Roster back button
  $('#roster-back-btn').addEventListener('click', () => {
    showScreen('teamView');
  });

  // Date navigation
  $('#prev-day').addEventListener('click', () => {
    state.selectedDate = shiftDate(state.selectedDate, -1);
    updateURL();
    renderDate();
    renderGames();
  });

  $('#next-day').addEventListener('click', () => {
    state.selectedDate = shiftDate(state.selectedDate, 1);
    updateURL();
    renderDate();
    renderGames();
  });

  $('#date-input').addEventListener('change', (e) => {
    if (e.target.value) {
      state.selectedDate = e.target.value;
      updateURL();
      renderDate();
      renderGames();
    }
  });

  // Browser back/forward
  window.addEventListener('popstate', () => {
    readURL();
    if (state.selectedTeamId) {
      if (!state.selectedDate) state.selectedDate = todayStr();
      renderTeamView();
      showScreen('teamView');
    } else {
      showScreen('teamSelect');
    }
  });

  // Retry
  $('#retry-btn').addEventListener('click', init);

  // Polling visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    } else {
      startPolling();
      refreshSchedule();
    }
  });
}

function startPolling() {
  if (state.pollTimer) clearInterval(state.pollTimer);
  state.pollTimer = setInterval(refreshSchedule, POLL_INTERVAL);
}

// ---- Init ----

async function init() {
  showScreen('loading');

  try {
    // Fetch WBC teams first
    state.wbcTeams = await fetchWBCTeams();

    // Fetch rosters and schedule in parallel
    const rosterPromises = state.wbcTeams.map(t => fetchRoster(t.id));
    const [rosterResults, schedule] = await Promise.all([
      Promise.all(rosterPromises),
      fetchSchedule(),
    ]);

    state.schedule = schedule;
    state.teamPlayerMap = buildTeamPlayerMap(state.wbcTeams, rosterResults);

    // Read URL params
    readURL();

    // Render team grid
    renderTeamGrid();

    // Show appropriate screen
    if (state.selectedTeamId) {
      if (!state.selectedDate) state.selectedDate = todayStr();
      renderTeamView();
      showScreen('teamView');
    } else {
      showScreen('teamSelect');
    }

    // Start polling for live scores
    startPolling();

    telemetry.signal('app.loaded', {
      teamsWithPlayers: String([...state.teamPlayerMap.keys()].length),
      totalGames: String(state.schedule.length),
    });

  } catch (err) {
    console.error('Init failed:', err);
    telemetry.signal('error.initFailed', { message: err.message || 'Unknown' });
    $('#error-message').textContent = err.message || 'Could not reach the MLB Stats API. Please try again.';
    showScreen('error');
  }
}

setupEvents();
init();
