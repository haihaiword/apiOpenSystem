/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: initalState | undefined,
) {
  const { loginUser } = initialState ?? {};
  return {
    canUser: loginUser ,
    canAdmin: loginUser?.userRole === 'admin',
  };
}
