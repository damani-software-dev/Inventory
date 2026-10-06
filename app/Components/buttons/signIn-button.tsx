"use client";

import { login } from "@/lib/actions/auth";
import Link from "next/link";
import React from "react";


export const SignInButton = () => {
    return(
        <button onClick={() => login()}>Google</button>
    ); 
}
