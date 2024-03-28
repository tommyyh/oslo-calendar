import React, { useState } from 'react';
import style from './form.module.scss';

type PropsType = {
  setInfo: any;
  info: any;
  setFormStage: any;
};

const Form = ({ setInfo, info, setFormStage }: PropsType) => {
  const [error, setError] = useState('');

  const onChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    setInfo({ ...info, [name]: value });
  };

  // Go to checkout
  const goToCheckout = () => {
    const { name, email, tel } = info;

    if (!name || !email || !tel) {
      return setError('Vennligst fyll ut alle feltene med en *.');
    }

    // Continue to finish
    setFormStage(4);
  };

  return (
    <main className={style.form}>
      <div className={style.forms}>
        <div className={style.personal}>
          <h2>Dine opplysninger</h2>

          {/* Name */}
          <div className={style.input}>
            <label htmlFor="name">Navn*</label>

            <div>
              <input
                type="text"
                placeholder="Anders Olsen"
                id="name"
                name="name"
                onChange={(e) => onChange(e)}
                value={info.name}
              />
            </div>
          </div>

          {/* Email */}
          <div className={style.input}>
            <label htmlFor="email">E-post*</label>

            <div>
              <input
                type="email"
                placeholder="andersolsen@gmail.com"
                id="email"
                name="email"
                onChange={(e) => onChange(e)}
                value={info.email}
              />
            </div>
          </div>

          {/* Phone number */}
          <div className={style.input}>
            <label htmlFor="tel">Telefonnummer*</label>

            <div>
              <input
                type="tel"
                placeholder="(+47) 93 03 77 00"
                id="tel"
                name="tel"
                onChange={(e) => onChange(e)}
                value={info.tel}
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

          {/* Type of trip */}
          <div className={style.input}>
            <label htmlFor="type">Type reise*</label>

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

          {/* Number of people */}
          <div className={style.input}>
            <label htmlFor="people">Antall personer*</label>

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
            <label htmlFor="length">Reiselengde*</label>

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

        <button onClick={goToCheckout}>Gå til kassen</button>
        {error && <p>{error}</p>}

        {/* End */}
      </div>
    </main>
  );
};

export default Form;
