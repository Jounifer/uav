export default function fromatrm(code, maxr, maxz) {

  const rs = []
  const ms = []
  for (let i = 0; i < maxz; i++) {

    rs[i] = maxr / (2 ** (i + 1))
    ms[i] = `${code}:${i}`

  }

  return {
    resolutions: rs,
    matrixIds: ms,
  }

}
