'use client'
import { useState } from 'react';
import Button from '../Button/Button';
import classes from './index.module.css'
import { accountURL } from '@/swr/fetcher';
import Spinner from '../Spinner';

export default function SignUp() {
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [sendForm, setSendForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    checkpassword: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    checkpassword?: string;
  }>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (value.length < 3) error = 'Имя должно быть не короче 3 символов';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = 'Некорректная почта';
        break;
      case 'password':
        if (value.length < 6) error = 'Минимум 6 символов';
        break;
      case 'checkpassword':
        if (value !== form.password) error = 'Пароли не совпадают';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const checkEmailExists = async () => {
    if (errors.email) return;

    try {
      const res = await fetch(`/api/check-email?email=${encodeURIComponent(form.email)}`);
      const data = await res.json();
      if (data) {
        setErrors(prev => ({ ...prev, email: 'Пользователь с такой почтой уже существует' }));
        return true
      }
    } catch (error) {
      console.error('Ошибка проверки email:', error);
    }
    return false;
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    const emailHasError = await checkEmailExists();
    if (emailHasError) return;

    const hasError = Object.values(errors).some(e => e !== '');
    if (hasError) return;

    setSendForm(true);

    try {
      const res = await fetch(accountURL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Ошибка создания пользователя");

    } catch (error) {
      console.error(error);
    } finally {
      setSendForm(false);
      setConfirmEmail(true);
    }
  };

  if (sendForm) return <div className='center'><Spinner /></div>

  if (confirmEmail) return <div className='center'><p className={classes.confirmEmail}>Регистрация прошла успешно! Проверьте почту и подтвердите ваш email</p></div>

  return <div className={classes.wrapper}>
    <form onSubmit={submitForm}>
      <label>
        Имя:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required />
        <span className={classes.errorText}>
          {errors.name || '\u00A0'}
        </span>
      </label>

      <label>
        Почта:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required />
        <span className={classes.errorText}>
          {errors.email || '\u00A0'}
        </span>
      </label>

      <label>
        Пароль:
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <span className={classes.errorText}>
          {errors.password || '\u00A0'}
        </span>
      </label>

      <label>
        Подтвердите пароль:
        <input
          type="password"
          name="checkpassword"
          value={form.checkpassword}
          onChange={handleChange}
          required
        />
        <span className={classes.errorText}>
          {errors.checkpassword || '\u00A0'}
        </span>
      </label>

      <Button type='submit'>Зарегестрироваться</Button>
    </form>
  </div>;
}