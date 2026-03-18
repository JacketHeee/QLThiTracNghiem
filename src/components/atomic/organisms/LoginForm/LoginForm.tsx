import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import Logo from "../../molecules/Logo/Logo";
import { TextField } from "../../molecules/TextField/TextField";
import { Button, Icon } from "../../atoms";
import Divider from "../../atoms/Divider/Divider";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Form submitted");
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <Logo large={true} />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-h6 text-text-primary">
            Chào mừng đến với MaChHiAn! 👋🏻
          </span>
          <span className="text-body-2 text-text-secondary">
            Vui lòng đăng nhập vào tài khoản của bạn và bắt đầu cuộc phiêu lưu.
          </span>
        </div>
        <TextField placeholder="Mã sinh viên" />
        <div className="flex flex-col gap-2">
          <TextField placeholder="Mật khẩu" />
          <div className="flex-bet-center">
            <Checkbox label="Nhớ lần này" />
            <span className="text-body-2 text-primary-main">
              {" "}
              Quên mật khẩu?
            </span>
          </div>
        </div>

        <Button
          variant={"contained"}
          color={"primary"}
          className="justify-center"
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>

        <div className="text-body-1 flex gap-1">
          <span className="text-text-secondary">Bạn chưa có tài khoản?</span>
          <Link to="/register">
            <span className="text-primary-main">Bắt đầu ngay</span>
          </Link>
        </div>

        <Divider> Hoặc</Divider>

        <div className="flex justify-center gap-2">
          <Button size={"medium"}>
            <Icon name="googleIcon" />
            Google
          </Button>{" "}
        </div>
      </div>
    </div>
  );
}
