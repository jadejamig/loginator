'use client'

import { CardWrapper } from './CardWrapper';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { LoginSchema } from '@/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ErrorForm } from '../FormError';
import { SuccessForm } from '../FormSuccess';
import { login } from '@/actions/login';
import Link from 'next/link';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider!' : "";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
  
        })
        .catch(() => setError("Something went wrong!"));
    })
  }

  return (
    <CardWrapper
        headerLabel='Welcome Back'
        backButtonLabel="Don't have an account?"
        backButtonHref='/auth/register'
        showSocial>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4'>
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} {...field} placeholder='john.doe@example.com' type='email'/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} {...field} placeholder='******' type='password'/>
                        </FormControl>
                        <Button size='sm' variant='link' asChild className='px-0 font-normal'>
                          <Link href='/auth/reset'>Forgot password?</Link>
                        </Button>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </>
              )}
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} placeholder='123456'/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              )}
            </div>
            { (showTwoFactor && !success && !error) && <SuccessForm message='2FA code sent to your email.'/>}
            <SuccessForm message={success}/>
            <ErrorForm message={error || urlError}/>
            <Button disabled={isPending} type='submit' className='w-full'>{showTwoFactor ? "Confirm" : "Login"}</Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm