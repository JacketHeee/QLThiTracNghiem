type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate({ children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}
