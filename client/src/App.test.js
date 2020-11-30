/* eslint-disable */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

afterEach(cleanup);

// making a snapshot
it('renders', () => {
  const {asFragment} = render( <App /> );
  expect(asFragment()).toMatchSnapshot();
});

/**
 * renderWithRouter(), to render the component(App) and pass history to the Router component.
 * this function will help us to know if the initial page is index or not
 */
const renderWithRouter = component => {
  const history = createMemoryHistory(); // createMemoryHistory(), to create a navigation history
  return {
    ...render(<Router history={history}>{component}</Router>),
  }
}

it("should render the index page", () => {
  const {getByTestId} = renderWithRouter(<App />);
  const navbar = getByTestId("navbar");
  const link = getByTestId("home-link");
  expect(navbar).toContainElement(link);
});

it("should navigate to the login page", () => {
  const {getByTestId} = renderWithRouter(<App />);
  fireEvent.click(getByTestId("login-link"));
  expect(getByTestId("login-title")).toHaveTextContent("Login")
});