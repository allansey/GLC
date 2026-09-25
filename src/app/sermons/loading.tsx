export default function Loading() {
    return (
        <div className="flex flex-col">
            <section className="bg-primary py-20 text-center text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="animate-pulse">
                        <div className="h-10 w-48 bg-primary-foreground/20 mx-auto mb-4 rounded"></div>
                        <div className="h-6 w-96 bg-primary-foreground/20 mx-auto rounded"></div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="animate-pulse">
                        <div className="h-8 w-64 bg-gray-200 mx-auto mb-8 rounded"></div>
                        <div className="max-w-4xl mx-auto">
                            <div className="aspect-video bg-gray-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-secondary/5">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="h-8 w-64 bg-gray-200 mx-auto mb-12 rounded"></div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video bg-gray-200 rounded-2xl mb-4"></div>
                                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
