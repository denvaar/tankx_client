const firstNames = [
  'brave',
  'clean',
  'crazy',
  'cute',
  'funky',
  'grumpy',
  'hungry',
  'insane',
  'large',
  'lumpy',
  'messy',
  'mixed',
  'radical',
  'remote-control',
  'small',
  'soothing',
  'timid'
]


const lastNames = [
  'accident',
  'beef',
  'boomsloot',
  'cattle',
  'dance',
  'hippo',
  'house',
  'large',
  'lobster',
  'miracle',
  'mouse',
  'mouth',
  'music',
  'oder',
  'oprah',
  'phone',
  'priest',
  'town',
  'trooper',
  'walk'
]

const generateGameName = () => {
  const firstNameMax = firstNames.length
  const lastNameMax = lastNames.length
  const fnId = Math.floor(Math.random() * firstNameMax)
  const lnId = Math.floor(Math.random() * lastNameMax)

  return `${firstNames[fnId]}-${lastNames[lnId]}`
}

export default generateGameName
