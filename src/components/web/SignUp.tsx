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
import { SignUpSchema, SignUpType } from '@/lib/validation'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: standardSchemaResolver(SignUpSchema),
  })
  const [transition, startTransition] = useTransition()
  const navigate = useNavigate()

  function handleFormSubmit(data: SignUpType) {
    startTransition(async () => {
      console.log(data)
      await authClient.signUp.email({
        name: data.name,
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
    <Card className="w-full max-w-lg ">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                disabled={transition}
                {...register('name')}
                placeholder="John Doe"
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.name &&
                    'focus-visible:border-red-600 focus-visible:border-2',
                )}
              />
              <FieldError
                errors={
                  errors.name ? [{ message: errors.name.message }] : undefined
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="username@gmail.com"
                {...register('email')}
                disabled={transition}
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                placeholder="Enter the password"
                type="password"
                {...register('password')}
                disabled={transition}
                className={cn(
                  'border border-black/10 outline-0 focus-visible:ring-0 focus-visible:outline-0 ring-0',
                  errors.password &&
                    'focus-visible:border-red-600 focus-visible:border-2',
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
            <FieldGroup>
              <Field>
                <Button disabled={transition} type="submit">
                  {transition ? 'Creating....' : 'Create Account'}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?
                  <Link disabled={transition} to="/login">
                    Login In
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
