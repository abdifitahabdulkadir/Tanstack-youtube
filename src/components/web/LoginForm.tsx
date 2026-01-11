import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { LoginInSchema, LoginType } from '@/lib/validation'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: standardSchemaResolver(LoginInSchema),
  })
  const navigate = useNavigate()
  const [transition, startTransition] = useTransition()

  async function handleLoginForm(data: LoginType) {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onError(context) {
            toast.error(context.error.message)
            console.log(context)
          },
          onSuccess() {
            toast.success('Successfully Created User')
            navigate({ to: '/' })
          },
        },
      })
    })
  }

  return (
    <Card className="max-w-lg w-full mx-auto">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleLoginForm)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...register('email')}
                disabled={transition}
                id="email"
                type="email"
                placeholder="username@gmail.com"
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.email &&
                    'focus-visible:border-red-600 focus-visible:border-2',
                )}
              />
              <FieldError
                errors={
                  errors.email ? [{ message: errors.email.message }] : undefined
                }
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  disabled={transition}
                  to="/login"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                {...register('password')}
                disabled={transition}
                id="password"
                placeholder="Enter Your password"
                type="password"
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.password &&
                    'focus-visible:border-2 focus-visible:border-red-600',
                )}
              />
              <FieldError
                errors={
                  errors.password
                    ? [{ message: errors.password.message }]
                    : undefined
                }
              />
            </Field>
            <Field>
              <Button type="submit">Login</Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
