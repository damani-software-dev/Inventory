import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const email = String(body.email || '').trim().toLowerCase()

        if (!email) {
            return NextResponse.json(
                { error: 'Enter your work email to continue.' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Don't reveal whether the email exists.
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with that email, a reset link has been sent.',
            })
        }

        // Remove any existing reset tokens for this user.
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        })

        // Generate a secure random token.
        const token = crypto.randomBytes(32).toString('hex')

        // Store only the hash of the token in the database.
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        // Token expires in 1 hour.
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await prisma.passwordResetToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt,
            },
        })

        // We'll use this when we add email sending.
        const resetUrl = `${process.env.NEXTAUTH_URL}/views/reset-password?token=${token}`

        console.log('Password reset URL:', resetUrl)

        return NextResponse.json({
            message: 'If an account exists with that email, a reset link has been sent.',
        })
    } catch (error) {
        console.error('Forgot password error:', error)

        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}