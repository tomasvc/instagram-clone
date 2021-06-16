import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export function ProtectedRoute({ user, children, ...rest }) {

    return (

      <Route
        {...rest}
        render={({ location }) => {
          if (user) {
            return React.cloneElement(children, { user });
          }
  
          if (!user) {
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location }
                }}
              />
            );
          }
  
          return null;
        }}
      />

    );

  }

ProtectedRoute.propTypes = {
    user: PropTypes.object,
    children: PropTypes.object.isRequired
};
  