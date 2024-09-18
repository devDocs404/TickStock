import { ReactNode } from "react";
// import { useStore } from "../Store/Store";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes = ({
  children,
}: ProtectedRoutesProps): JSX.Element | null => {
  // const navigate = useNavigate();

  // const { token } = useStore((state) => ({
  //   token: state.token,
  // }));

  // useEffect(() => {
  //   if (token === "") {
  //     navigate("/login", { replace: true });
  //   }
  // }, [token, navigate]);

  // if (token === "") {
  //   return null; // If no token, return nothing
  // }

  return <>{children}</>; // Render children if token exists
};

export default ProtectedRoutes;

// import { useEffect, ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStore } from "../Store/Store";

// interface ProtectedRoutesProps {
//   children: ReactNode;
// }

// // Define the type for your store's state
// interface StoreState {
//   token: string;
//   // Add other properties if necessary
// }

// const ProtectedRoutes = ({
//   children,
// }: ProtectedRoutesProps): JSX.Element | null => {
//   const navigate = useNavigate();

//   // Provide an explicit type for the 'state' parameter
//   const { token } = useStore((state: StoreState) => ({
//     token: state.token,
//   }));

//   useEffect(() => {
//     if (token === "") {
//       navigate("/login", { replace: true });
//     }
//   }, [token, navigate]);

//   if (token === "") {
//     return null; // If no token, return nothing
//   }

//   return <>{children}</>; // Render children if token exists
// };

// export default ProtectedRoutes;
