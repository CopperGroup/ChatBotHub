import { MetadataRoute } from "next";

export default function functionName(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard", "/reset-password", "/staff", "/workflows", "/api", "/websites", "/token-purchase", "/settings"]
            }
        ],
    }
}