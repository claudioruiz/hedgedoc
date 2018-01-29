var config = require('./config')
var uuid = require('uuid')

var CspStrategy = {}

var defaultDirectives = {
  defaultSrc: ['\'self\''],
  scriptSrc: ['\'self\'', 'vimeo.com', 'https://gist.github.com', 'www.slideshare.net', 'https://query.yahooapis.com', 'https://*.disqus.com', '\'unsafe-eval\''],
  // ^ TODO: Remove unsafe-eval - webpack script-loader issues https://github.com/hackmdio/hackmd/issues/594
  imgSrc: ['*'],
  styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://assets-cdn.github.com'], // unsafe-inline is required for some libs, plus used in views
  fontSrc: ['\'self\'', 'https://public.slidesharecdn.com'],
  objectSrc: ['*'], // Chrome PDF viewer treats PDFs as objects :/
  childSrc: ['*'],
  connectSrc: ['*']
}

var cdnDirectives = {
  scriptSrc: ['https://cdnjs.cloudflare.com', 'https://cdn.mathjax.org'],
  styleSrc: ['https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
  fontSrc: ['https://cdnjs.cloudflare.com', 'https://fonts.gstatic.com']
}

CspStrategy.computeDirectives = function () {
  var directives = {}
  mergeDirectives(directives, config.csp.directives)
  mergeDirectivesIf(config.csp.addDefaults, directives, defaultDirectives)
  mergeDirectivesIf(config.usecdn, directives, cdnDirectives)
  if (!areAllInlineScriptsAllowed(directives)) {
    addInlineScriptExceptions(directives)
  }
  addUpgradeUnsafeRequestsOptionTo(directives)
  return directives
}

function mergeDirectives (existingDirectives, newDirectives) {
  for (var propertyName in newDirectives) {
    var newDirective = newDirectives[propertyName]
    if (newDirective) {
      var existingDirective = existingDirectives[propertyName] || []
      existingDirectives[propertyName] = existingDirective.concat(newDirective)
    }
  }
}

function mergeDirectivesIf (condition, existingDirectives, newDirectives) {
  if (condition) {
    mergeDirectives(existingDirectives, newDirectives)
  }
}

function areAllInlineScriptsAllowed (directives) {
  return directives.scriptSrc.indexOf('\'unsafe-inline\'') !== -1
}

function addInlineScriptExceptions (directives) {
  directives.scriptSrc.push(getCspNonce)
  // TODO: This is the SHA-256 hash of the inline script in build/reveal.js/plugins/notes/notes.html
  // Any more clean solution appreciated.
  directives.scriptSrc.push('\'sha256-EtvSSxRwce5cLeFBZbvZvDrTiRoyoXbWWwvEVciM5Ag=\'')
}

function getCspNonce (req, res) {
  return "'nonce-" + res.locals.nonce + "'"
}

function addUpgradeUnsafeRequestsOptionTo (directives) {
  if (config.csp.upgradeInsecureRequests === 'auto' && config.usessl) {
    directives.upgradeInsecureRequests = true
  } else if (config.csp.upgradeInsecureRequests === true) {
    directives.upgradeInsecureRequests = true
  }
}

CspStrategy.addNonceToLocals = function (req, res, next) {
  res.locals.nonce = uuid.v4()
  next()
}

module.exports = CspStrategy