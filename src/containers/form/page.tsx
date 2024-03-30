import React, { useState } from 'react';
import style from './form.module.scss';
import GoBack from '@/components/GoBack/GoBack';
import { useRouter } from 'next/navigation';
import libphonenumber from 'google-libphonenumber';

type PropsType = {
  setInfo: any;
  info: any;
  setFormStage: any;
  special: boolean;
};

// Validations
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Phone validation
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const isValidPhoneNumber = (phoneNumber: string) => {
  // Remove spaces from the phone number
  const cleanedPhoneNumber = phoneNumber.replaceAll(' ', '');

  try {
    const number = phoneUtil.parse(cleanedPhoneNumber);

    return phoneUtil.isValidNumber(number);
  } catch (error) {
    return false; // Invalid phone number format
  }
};

const ERROR_COLOR = '#df1b41';

// Component
const Form = ({ setInfo, info, setFormStage, special }: PropsType) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState({
    name: false,
    email: false,
    tel: false,
  });
  const { push } = useRouter();

  const onChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    setInfo({ ...info, [name]: value });
  };

  // Submit
  const goToCheckout = async () => {
    setLoading(true);

    const { name, email, tel } = info;

    if (!name || !email || !tel) {
      !name && setInvalid({ ...invalid, name: true });
      !email && setInvalid({ ...invalid, email: true });
      !tel && setInvalid({ ...invalid, tel: true });
      setError('Vennligst skriv inn alle feltene med en *.');
      setLoading(false);

      return;
    }
    if (!validateEmail(email)) {
      setInvalid({ ...invalid, email: true });
      setError('Vennligst skriv inn en gyldig e-postadresse');
      setLoading(false);

      return;
    }
    if (!isValidPhoneNumber(tel)) {
      setInvalid({ ...invalid, tel: true });
      setError('Vennligst skriv inn en gyldig telefonnummer (+47...)');
      setLoading(false);

      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });

      const data = await res.json();

      if (data.status === 'success') {
        return push('/checkout');
      } else {
        setError('Noe gikk galt, prøv igjen eller kontakt oss.');
      }
    } catch (e) {
      setError('Noe gikk galt, prøv igjen eller kontakt oss.');
    }

    setLoading(false);
  };

  return (
    <main className={style.form}>
      <GoBack onClick={() => setFormStage(2)} />

      <div className={style.forms}>
        <div className={style.personal}>
          <h2>Dine opplysninger</h2>

          {/* Name */}
          <div className={style.input}>
            <label
              style={invalid.name ? { color: ERROR_COLOR } : {}}
              htmlFor="name"
            >
              Navn *
            </label>

            <div>
              <input
                type="text"
                placeholder="Anders Olsen"
                id="name"
                name="name"
                onChange={(e) => onChange(e)}
                onFocus={() => {
                  setError('');
                  setInvalid({ ...invalid, name: false });
                }}
                value={info.name}
                style={invalid.name ? { borderColor: ERROR_COLOR } : {}}
              />
            </div>
          </div>

          {/* Email */}
          <div className={style.input}>
            <label
              style={invalid.email ? { color: ERROR_COLOR } : {}}
              htmlFor="email"
            >
              E-post *
            </label>

            <div>
              <input
                type="email"
                placeholder="andersolsen@gmail.com"
                id="email"
                name="email"
                onChange={(e) => onChange(e)}
                onFocus={() => {
                  setError('');
                  setInvalid({ ...invalid, email: false });
                }}
                value={info.email}
                style={invalid.email ? { borderColor: ERROR_COLOR } : {}}
              />
            </div>
          </div>

          {/* Phone number */}
          <div className={style.input}>
            <label
              style={invalid.tel ? { color: ERROR_COLOR } : {}}
              htmlFor="tel"
            >
              Telefonnummer *
            </label>

            <div>
              <input
                type="tel"
                placeholder="(+47) 93 03 77 00"
                id="tel"
                name="tel"
                onChange={(e) => onChange(e)}
                onFocus={() => {
                  setError('');
                  setInvalid({ ...invalid, tel: false });
                }}
                value={info.tel}
                style={invalid.tel ? { borderColor: ERROR_COLOR } : {}}
              />
            </div>
          </div>

          {/* Message */}
          <div className={style.input}>
            <label htmlFor="msg">Melding</label>

            <div>
              <textarea
                name="msg"
                id="msg"
                placeholder="Ikke at..."
                onChange={(e) => onChange(e)}
                value={info.msg}
              ></textarea>
            </div>
          </div>
        </div>

        <div className={style.trip}>
          <h2>Detaljer om reisen</h2>

          {/* Trip destination */}
          <div className={style.input}>
            <label htmlFor="destination">Reiserute *</label>

            <div>
              <select
                name="destination"
                id="destination"
                onChange={(e) => onChange(e)}
                value={info.destination}
              >
                <option value="Bygdøy">Bygdøy</option>
                <option value="Dyna Fyr">Dyna Fyr</option>
                <option value="Hovedøya">Hovedøya</option>
                <option value="Kjeholmen">Kjeholmen</option>
                <option value="Oscarsborg">Oscarsborg</option>
                <option value="Oslofjorden">Oslofjorden</option>
                <option value="Villa Malla">Villa Malla</option>
                <option value="Middagsbukta">Middagsbukta</option>
                <option value="Din drømmedag">Din drømmedag</option>
              </select>
            </div>
          </div>

          {/* Type of trip */}
          {special && (
            <div className={style.input}>
              <label htmlFor="type">Type reise *</label>

              <div>
                <select
                  name="type"
                  id="type"
                  onChange={(e) => onChange(e)}
                  value={info.type}
                >
                  <option value="public">Offentlig</option>
                  <option value="private">Privat</option>
                </select>
              </div>
            </div>
          )}

          {/* Number of people */}
          <div className={style.input}>
            <label htmlFor="people">Antall personer *</label>

            <div>
              <select
                name="people"
                id="people"
                onChange={(e) => onChange(e)}
                value={info.people}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className={style.input}>
            <label htmlFor="length">Reiselengde *</label>

            <div>
              <select
                name="length"
                id="length"
                onChange={(e) => onChange(e)}
                value={info.length}
              >
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className={style.error}>{error}</p>}
        <button
          onClick={goToCheckout}
          disabled={loading}
          style={loading ? { cursor: 'not-allowed', opacity: '0.5' } : {}}
        >
          {loading ? 'Bearbeiding...' : 'Gå til kassen'}
        </button>

        {/* End */}
      </div>
    </main>
  );
};

export default Form;
