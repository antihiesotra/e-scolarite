/*
  Tsiory Fitiavana ANHY KRISHNA <tsiory.krishna@gmail.com>
 */

/**
 * Divise le tableau 'tab' en 'n' sous tableaux
 * @param tab
 * @param n
 * @param balanced
 * @returns {*} tableau contenant les sous tableaux
 */
export default function chunck (tab, n, balanced = true) {
  if (n < 2) {
    return [tab]
  }

  let len = tab.length,
    out = [],
    i = 0,
    size

  if (len % n === 0) {
    size = Math.floor(len / n)
    while (i < len) {
      out.push(tab.slice(i, i += size))
    }
  }
  else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--)
      out.push(tab.slice(i, i += size))
    }
  }
  else {
    n--
    size = Math.floor(len / n)
    if (len % size === 0) {
      size--
    }
    while (i < size * n) {
      out.push(tab.slice(i, i += size))

      out.push(tab.slice(size * n))
    }
  }
  return out
}
