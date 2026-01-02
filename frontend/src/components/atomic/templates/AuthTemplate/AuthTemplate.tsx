type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
