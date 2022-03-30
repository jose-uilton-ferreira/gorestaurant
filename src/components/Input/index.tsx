import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { InputProps as HTMLInputProps } from 'react-html-props';

import { useField } from '@unform/core';

import { Container } from './styles';
import { IconType } from 'react-icons';

interface InputProps extends HTMLInputProps {
  icon?: IconType;
}

export function Input({ name, icon: Icon, ...rest }: InputProps) {
  name = name ?? "";
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}

      <input
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        {...rest}
        />
    </Container>
  );
};
