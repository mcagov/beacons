import { useAuthContext } from "components/auth/AuthProvider";

export function UserRolesView(): JSX.Element {
  const { user } = useAuthContext();

  if (user.type !== "loggedInUser") {
    return <p>User not logged in.</p>;
  }

  return (
    <ul className="roles">
      {user.attributes.roles &&
        user.attributes.roles.map((role, index) => (
          <li key={index}>{role} </li>
        ))}
    </ul>
  );
}
