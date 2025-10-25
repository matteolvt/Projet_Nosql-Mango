import { useMemo } from 'react'
import './AddressForm.css'

export default function AddressForm({ value, onChange, onValidChange, showTitle = true }) {
  const isValid = useMemo(() => {
    const streetOk = value.street?.trim().length > 0
    const cityOk = value.city?.trim().length > 0
    const zipOk = /^\d{5}$/.test((value.zip || '').trim())
    return streetOk && cityOk && zipOk
  }, [value])

  if (onValidChange) {
    onValidChange(isValid)
  }

  return (
    <section className="address">
        {showTitle && (
      <>
        <h3 className="address-title">Où veux-tu te faire livrer ?</h3>
        <p className="address-sub">En salle de TD ? 🚀</p>
      </>
      )}

      <form className="address-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Rue
          <input
            type="text"
            placeholder="Ex : 10 rue des Écoles"
            value={value.street}
            onChange={(e) => onChange({ ...value, street: e.target.value })}
            required
          />
        </label>

        <div className="address-row">
          <label>
            Ville
            <input
              type="text"
              placeholder="Ex : Paris"
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
            />
          </label>

          <label>
            Code postal
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              placeholder="Ex : 75005"
              value={value.zip}
              onChange={(e) => onChange({ ...value, zip: e.target.value })}
            />
          </label>
        </div>

        {!isValid && (value.street || value.city || value.zip) && (
          <p className="address-hint">Veuillez renseigner Rue, Ville et un code postal à 5 chiffres.</p>
        )}
      </form>
    </section>
  )
}
