import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
})

export const sendWelcomeEmail = async (userEmail: string, fullName: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Chào mừng bạn đến với E Coffee',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Xin chào ${fullName}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại E Coffee.</p>
        <p>Tài khoản của bạn đã được tạo thành công.</p>
        <p>Chúc bạn có những trải nghiệm tuyệt vời!</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (userEmail: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Yêu cầu đặt lại mật khẩu',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để tiếp tục:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Đặt lại mật khẩu
        </a>
        <p>Link này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
} 