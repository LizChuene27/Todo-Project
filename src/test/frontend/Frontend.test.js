import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/auth/Login';
import {BrowserRouter as Router} from 'react-router-dom';

describe('Login Tests', () => {
    it('should contains the Login heading', () => {
    render(<Router><Login /></Router>);
        const heading = screen.getByText(/User Login/i);
        expect(heading).toBeInTheDocument()
    });

test('FocusInput matches snapshot', () => {
  const { container } = render(<Router><Login /></Router>)
  expect(container.firstChild).toMatchSnapshot();
});

test('Login Button Text should be Login', () => {
  const { getByTestId } = render(<Router><Login /></Router>)
  expect(getByTestId("loginBtn").textContent).toBe("Login");
});

test('check input feilds onChange', () => {
  const { getByTestId } = render(<Router><Login /></Router>);
  const user_input = getByTestId("user-name");
  const pass_input = getByTestId("user-password");

  fireEvent.change(user_input, { target: { name: "username", value: "assdf" }});
  fireEvent.change(pass_input, { target: { name: "password", value: "fakepass" }});

  expect(user_input.value).toBe("assdf");
  expect(pass_input.value).toBe("fakepass");
});

});
