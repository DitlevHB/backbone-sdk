const terminal = require( 'terminal-kit' ).terminal

export function log(str = '', no_br?, color = 'green') {
  terminal[color](`${str}${no_br ? '' : '\n'}`)
}

export function term() {
  return terminal
}