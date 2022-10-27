/**
 * Remplace l'élément dans 'chunckedArray' par 'value'
 * @param chunckedArray
 * @param value
 * @returns {Array} renvoi un nouveau tableau contenant l'élément modifié
 */
export default function resetCardValue (chunckedArray, value) {
  // permet de retrouver puis de réinitialiser l'élément à modifier dans la vue cards
  for (let j = 0; j < chunckedArray.length; j++) {
    let col = chunckedArray[j]
    for (var i = 0; i < col.length; i++) {
      if (col[i].id === value.id) {
        col[i] = value
        break
      }
    }
    if (col[i] === value) {
      break // sort de la boucle dès que l'élément a été réinitialisé
    }
  }
  return chunckedArray
}
