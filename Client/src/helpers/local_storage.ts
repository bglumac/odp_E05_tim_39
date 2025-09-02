function SacuvajVrednostPoKljucu(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Greska pri cuvanju u localStorage za kljuc '${key}':`, error)
    return false
  }
}

function ProcitajVrednostPoKljucu(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Greska pri citanju iz localStorage za kljuc '${key}':`, error)
    return null
  }
}

function ObrisiVrednostPoKljucu(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Greska pri brisanju iz localStorage za kljuc '${key}':`, error)
    return false
  }
}

export { SacuvajVrednostPoKljucu, ProcitajVrednostPoKljucu, ObrisiVrednostPoKljucu };