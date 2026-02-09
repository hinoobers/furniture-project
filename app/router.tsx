import { Href, router } from "expo-router";

export function go(href: Href) {
    router.push(href);
}

export function back() {
    router.back();
}