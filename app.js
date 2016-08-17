var firePartSize = 0.25
var stoneCount = 6

function createObject (eln, className, width, height, left, top) {
  var obj = document.createElement(eln)
  obj.style.width = width
  obj.style.height = height
  obj.style.left = left
  obj.style.top = top
  obj.classList.add(className)
  return obj
}

function random (from, to) {
  return Math.random() * Math.abs(from - to) + from
}

function createFireParts (el, limit) {
  for (var i = 16; i >= limit; i--) {
    var size = (firePartSize * i) + 'em'
    var top = (Math.pow(firePartSize * i,1.5)/2) + 'em'
    var left = -(firePartSize * i)/2 + 'em'
    var part = createObject('div', 'fire-part', size, size, left, top)
    part.style.animationDelay = i/3 + 's'
    el.appendChild(part)
  }
}

function createStones (el, mul) {
  for (var i = 0; i <= stoneCount; i++) {
    var size = random(3, 4) + 'em'
    var left = ((i-1) / stoneCount) * 100 + '%'
    var top = mul * Math.sin(i * (Math.PI / stoneCount)) * 100 + '%'
    var stone = createObject('div', 'stone', size, size, left, top)
    el.appendChild(stone)
  }
}

function createCoal (el) {
  for (var i = 0; i <= 32; i++) {
    var size = random(0.75, 1.5) + 'em'
    var coal = createObject('div', 'coal-i', size, size, random(-3, 3) + 'em', random(-1, 1) + 'em')
    el.appendChild(coal)
  }
}

function generate () {
  createFireParts(document.getElementById('fire-1'), 0)
  createFireParts(document.getElementById('fire-2'), 8)
  createStones(document.getElementById('stones-back'), -1)
  createStones(document.getElementById('stones-front'), 1)
  createCoal(document.getElementById('coal'))
}

function updatePeopleCount (count) {
  document.getElementById('people').innerHTML = count
}

function updateInviteLink (url) {
  document.getElementById('invite').setAttribute('href', url)
  document.getElementById('invite-text').innerHTML = url
}

function addPeopleAvatar (avatarUrl, name) {
  var span = document.createElement('span')
  var avatar = document.createElement('img')
  avatar.setAttribute('src', avatarUrl)
  span.setAttribute('aria-label', name)
  span.classList.add('hint--top')
  span.appendChild(avatar)
  document.getElementById('people-avatars').appendChild(span)
}

function readDiscordData (serverID) {
  var oReq = new XMLHttpRequest()
  oReq.onload = function () {
    var data = JSON.parse(this.responseText)
    updatePeopleCount(data.members.length)
    updateInviteLink(data.instant_invite)
    var count = 0, limit = 8
    for (var i in data.members) {
      addPeopleAvatar(data.members[i].avatar_url, data.members[i].username)
      if (count + 1 >= limit) {
        addPeopleAvatar('more.jpg', '... a další')
        break
      }
      count++
    }
  };
  oReq.open('get', 'https://discordapp.com/api/servers/' + serverID + '/widget.json', true)
  oReq.send()
}

generate()
readDiscordData('107517431722823680')
