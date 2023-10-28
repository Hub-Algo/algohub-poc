interface ButtonPropsInterface {
  content: string
}

const Button = ({ content }: ButtonPropsInterface) => {
  return <div>{content}</div>
}

export default Button
