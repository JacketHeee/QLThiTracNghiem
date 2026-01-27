type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate({ children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-4">
      <div className="w-full max-w-[430px] rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        {children}
      </div>
    </div>
  );
}
