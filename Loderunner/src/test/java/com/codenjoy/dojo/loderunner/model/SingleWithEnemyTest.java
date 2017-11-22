package com.codenjoy.dojo.loderunner.model;

/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2016 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */


import com.codenjoy.dojo.loderunner.services.Events;
import com.codenjoy.dojo.services.Dice;
import com.codenjoy.dojo.services.EventListener;
import com.codenjoy.dojo.services.PrinterFactory;
import com.codenjoy.dojo.services.PrinterFactoryImpl;
import org.junit.Test;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertTrue;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * User: sanja
 * Date: 19.12.13
 * Time: 5:22
 */
public class SingleWithEnemyTest {

    private Dice dice;
    private EventListener listener;
    private Single game;
    private Loderunner loderunner;
    private PrinterFactory printerFactory = new PrinterFactoryImpl();

    // чертик идет за тобой
    @Test
    public void shoulEnemyGoToHero() {
        setupGm("☼☼☼☼☼☼☼☼" +
                "☼     »☼" +
                "☼H#####☼" +
                "☼H     ☼" +
                "☼###H  ☼" +
                "☼►  H  ☼" +
                "☼######☼" +
                "☼☼☼☼☼☼☼☼");

        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼    « ☼\n" +
                "☼H#####☼\n" +
                "☼H     ☼\n" +
                "☼###H  ☼\n" +
                "☼►  H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        game.tick();
        game.tick();
        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼«     ☼\n" +
                "☼H#####☼\n" +
                "☼H     ☼\n" +
                "☼###H  ☼\n" +
                "☼►  H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼H#####☼\n" +
                "☼Q     ☼\n" +
                "☼###H  ☼\n" +
                "☼►  H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        game.tick();
        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼H#####☼\n" +
                "☼H  »  ☼\n" +
                "☼###H  ☼\n" +
                "☼►  H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        game.tick();
        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼H#####☼\n" +
                "☼H     ☼\n" +
                "☼###H  ☼\n" +
                "☼► «H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼H#####☼\n" +
                "☼H     ☼\n" +
                "☼###H  ☼\n" +
                "☼Ѡ  H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        verify(listener).event(Events.KILL_HERO);
        assertTrue(game.isGameOver());

        when(dice.next(anyInt())).thenReturn(1, 4);

        game.newGame();

        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼H#####☼\n" +
                "☼H  ►  ☼\n" +
                "☼###H  ☼\n" +
                "☼ » H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");
    }

    // чертик идет за тобой по более короткому маршруту
    @Test
    public void shouldEnemyGoToHeroShortestWay() {
        setupGm("☼☼☼☼☼☼☼☼" +
                "☼     »☼" +
                "☼H####H☼" +
                "☼H    H☼" +
                "☼###H##☼" +
                "☼  ►H  ☼" +
                "☼######☼" +
                "☼☼☼☼☼☼☼☼");

        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼H####Q☼\n" +
                "☼H    H☼\n" +
                "☼###H##☼\n" +
                "☼  ►H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

    }

    @Test
    public void shouldEnemyGoToHeroShortestWay2() {
        setupGm("☼☼☼☼☼☼☼☼" +
                "☼»     ☼" +
                "☼H####H☼" +
                "☼H    H☼" +
                "☼###H##☼" +
                "☼  ►H  ☼" +
                "☼######☼" +
                "☼☼☼☼☼☼☼☼");

        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼Q####H☼\n" +
                "☼H    H☼\n" +
                "☼###H##☼\n" +
                "☼  ►H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

    }

    // другой чертик чертику не помеха
    @Test
    public void shouldEnemyGoToHeroShortestWayGetRoundOther() {
        setupGm("☼☼☼☼☼☼☼☼" +
                "☼»    »☼" +
                "☼H####H☼" +
                "☼H    H☼" +
                "☼###H##☼" +
                "☼  ►H  ☼" +
                "☼######☼" +
                "☼☼☼☼☼☼☼☼");

        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼      ☼\n" +
                "☼Q####Q☼\n" +
                "☼H    H☼\n" +
                "☼###H##☼\n" +
                "☼  ►H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

    }

    @Test
    public void shouldEnemyGoToHeroShortestWayGetRoundOther2() {
        setupGm("☼☼☼☼☼☼☼☼" +
                "☼» »   ☼" +
                "☼H####H☼" +
                "☼H    H☼" +
                "☼###H##☼" +
                "☼  ►H  ☼" +
                "☼######☼" +
                "☼☼☼☼☼☼☼☼");

        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼ «    ☼\n" +
                "☼Q####H☼\n" +
                "☼H    H☼\n" +
                "☼###H##☼\n" +
                "☼  ►H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

    }

    // если чертику не достать одного он бежит за другим а не зависает
    @Test
    public void shouldEnemyGoToNewHeroIfOneIsHidden() {
        setupGm("☼☼☼☼☼☼☼☼" +
                "☼   ►  ☼" +
                "☼######☼" +
                "☼      ☼" +
                "☼###H##☼" +
                "☼»  H  ☼" +
                "☼######☼" +
                "☼☼☼☼☼☼☼☼");

        game.tick();
        game.tick();
        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼   ►  ☼\n" +
                "☼######☼\n" +
                "☼      ☼\n" +
                "☼###H##☼\n" +
                "☼»  H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");

        setupPlayer(1, 4);
        game.tick();
        game.tick();
        game.tick();
        game.tick();
        game.tick();
        game.tick();
        game.tick();
        game.tick();
        game.tick();

        atGame(
                "☼☼☼☼☼☼☼☼\n" +
                "☼   (  ☼\n" +
                "☼######☼\n" +
                "☼Ѡ     ☼\n" +
                "☼###H##☼\n" +
                "☼   H  ☼\n" +
                "☼######☼\n" +
                "☼☼☼☼☼☼☼☼\n");
    }


    private void atGame(String expected) {
        assertEquals(expected, game.getBoardAsString());
    }

    private void setupPlayer(int x, int y) {
        listener = mock(EventListener.class);
        game = new Single(loderunner, listener, printerFactory);
        when(dice.next(anyInt())).thenReturn(x, y);
        game.newGame();
    }

    private void setupGm(String map) {
        Level level = new LevelImpl(map);
        dice = mock(Dice.class);
        loderunner = new Loderunner(level, dice);

        int px = level.getHeroes().get(0).getX();
        int py = level.getHeroes().get(0).getY();
        setupPlayer(px, py);
    }
}
