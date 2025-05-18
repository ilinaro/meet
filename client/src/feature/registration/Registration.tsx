import React from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import styles from "./Registration.module.scss";
import { useSignupQuery } from "../../lib";
import { Button, Input } from "../../components";

type SignupFormData = {
  email: string;
  password: string;
  nickname: string;
  re_password: string;
};

export const Registration: React.FC = () => {
  const { mutate: sendSignupForm, isPending, isSuccess } = useSignupQuery();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: { email: "", password: "", re_password: "" },
  });
  const password = watch("password", "");

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {
    if (!data.email || !data.password || !data.re_password) return;
    sendSignupForm({
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    });
  };

  return (
    <div className={styles.card}>
      {isSuccess ? (
        <>
          <div className={styles.successMessage}>
            <div>Спасибо за регистрацию!</div>
            <div className={styles.successText}>
              Подтвердите регистрацию через email.
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.linkWrapper}>
            Уже есть аккаунт?{" "}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email обязателен" }}
              render={({ field }) => (
                <Input
                  label="Email"
                  placeholder="Email"
                  type="email"
                  required
                  autoFocus
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="nickname"
              control={control}
              rules={{ required: "Nickname обязателен" }}
              render={({ field }) => (
                <Input
                  label="Nickname"
                  placeholder="Nickname"
                  type="text"
                  required
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Пароль обязателен",
                minLength: 8,
              }}
              render={({ field }) => (
                <Input
                  label="Пароль"
                  placeholder="***"
                  type="password"
                  required
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
            <p className={styles.countPass}>
              {password.length < 8 &&
                !errors.password?.message &&
                `Осталось символов: ${8 - password.length}`}
            </p>
            <Controller
              name="re_password"
              control={control}
              rules={{
                required: "Подтверждение обязательно",
                validate: (value) =>
                  value === password || "Пароли не совпадают",
              }}
              render={({ field }) => (
                <Input
                  label="Повторите пароль"
                  placeholder="***"
                  type="password"
                  required
                  error={errors.re_password && errors.re_password.message}
                  {...field}
                />
              )}
            />
            <Button
              classNames={styles.button}
              fullWidth
              type="submit"
              isLoading={isPending}
            >
              Зарегистрироваться
            </Button>
          </form>
        </>
      )}
    </div>
  );
};
